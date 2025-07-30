import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UploadedFile, UseInterceptors, Param } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerDTO } from "./create-seller.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";

@Controller("seller")
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // Endpoint to get the seller profile
  @Get("profile")
  getProfile(): string {
    return this.sellerService.getProfile();
  }

  // Endpoint to create a new seller
  @Post("create")
  @UsePipes(new ValidationPipe())
  createSeller(@Body() data: SellerDTO): SellerDTO {
    return this.sellerService.createSeller(data);
  }

// Get all sellers
@Get('all')
findAll(): SellerDTO[] {
  return this.sellerService.findAll();
}
@Get('find/:nid')
getByNid(@Param('nid') nid: string): SellerDTO | string {
  const seller = this.sellerService.getByNid(nid);
  if (!seller) {
    return `Seller with NID ${nid} not found.`;
  }
  return seller;
}



  // Endpoint to upload NID image (e.g., for validation purposes)
  @Post("uploadfile")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|pdf)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError("LIMIT_UNEXPECTED_FILE", "file"), false);
        }
      },
      limits: { fileSize: 2000000 }, // File size limit of 2 MB
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
        },
      }),
    })
  )
  uploadNID(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: "NID uploaded successfully", file };
  }
}

