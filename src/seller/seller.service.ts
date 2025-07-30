import { Injectable } from "@nestjs/common";
import { SellerDTO } from "./create-seller.dto";

@Injectable()
export class SellerService {
  private sellers: SellerDTO[] = [];

  // Fetch the Seller profile
  getProfile(): string {
    return "Seller Profile Page";
  }

  // Create a new Seller
  createSeller(data: SellerDTO): SellerDTO {
    const newSeller: SellerDTO = {
      name: data.name,
      email: data.email,
      nid: data.nid,
    };
    this.sellers.push(newSeller);
    return newSeller;
  }

  // Find all sellers
  findAll(): SellerDTO[] {
    return this.sellers;
  }


 getByNid(nid: string): SellerDTO | undefined {
    return this.sellers.find(seller => seller.nid === nid);
  }

}
