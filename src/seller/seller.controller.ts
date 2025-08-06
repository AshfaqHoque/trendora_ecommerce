import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UploadedFile, UseInterceptors, Param, UseGuards, BadRequestException, UseFilters, HttpException, Req, Res, Put } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerDTO } from "./dtos/create-seller.dto";
import { Seller } from './seller.entity';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { SellerGuard } from "./guards/seller.guard";
import { SellerPipeEmail, SellerPipeName, SellerPipeNid } from './pipes/seller.pipe'; // Adjust relative path
import { SellerCustomExceptionFilter } from "./exceptions/seller.exception.filter";
import { SellerInterceptor } from "./interceptor/seller.interceptor";
import { Request, Response } from 'express';



@Controller("sellers")
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

 //-----------route connected with database--------
  @Post('/create')
  @UsePipes(new ValidationPipe())
  async createSeller(@Body() sellerDTO: SellerDTO): Promise<Seller> {
    return this.sellerService.createSeller(sellerDTO.fullName, sellerDTO.age);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'active' | 'inactive',
  ): Promise<Seller> {
    return this.sellerService.updateStatus(id, status);
  }

  @Get('inactive')
  async getInactiveSellers(): Promise<Seller[]> {
    return this.sellerService.getInactiveSellers();
  }

  @Get('older-than-40')
  async getSellersOlderThan40(): Promise<Seller[]> {
    return this.sellerService.getSellersOlderThan40();
  }

//----------route without connected database---------
  
  @Get("profile")
  @UseGuards(new SellerGuard())
  getProfile(): string {
    return this.sellerService.getProfile();
  }

 //builtin pipe validation
  // @Post("create")
  // @UsePipes(new ValidationPipe())
  // createSeller(@Body() data: SellerDTO): Promise<Seller> {
  //   return this.sellerService.createSeller(data);
  // }

//custom pipe validation
  // @Post("input")
  // @UseGuards(new SellerGuard())
  // @UsePipes(new SellerPipeNid(),new SellerPipeEmail(),new SellerPipeName())
  // inputSeller(@Body(new SellerPipeNid(),new SellerPipeEmail(),new SellerPipeName()) data: SellerDTO): Promise<Seller> {
  //   return this.sellerService.createSeller(data);
  // }


@Get('all')
findAll(): Promise<Seller[]> {
  return this.sellerService.findAll();
}

// @Get('find/:nid')
// async getByNid(@Param('nid') nid: string): Promise<string | Seller> {
//   const seller = await this.sellerService.getByNid(nid);
//   if (!seller) {
//     // Return a string message wrapped in a Promise
//     return Promise.resolve(`Seller with NID ${nid} not found.`);
//   }
//   return seller; // Return the found seller
// }







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
      limits: { fileSize: 2000000 }, 
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

 //custom exception
  @Get('exception')
  helloBookApi():string{


    throw new BadRequestException({

   
    status: 400,
    error: "this my custmom error"

  }

  );

    return "Hi, i am seller";
  }

  //custom exceptionFilter

  @Get("exceptionFilter")
  @UseFilters(SellerCustomExceptionFilter)  
  All() {
    
    throw new BadRequestException();
    //throw new HttpException('Forbidden', 403); // Example exception
  }



  //interceptor: can modify both --request and response
  //interceptor er through attach product object and response change
  @Post("product")
  @UseInterceptors(SellerInterceptor)
  product(): any {
    return "this is the response";
  }

}