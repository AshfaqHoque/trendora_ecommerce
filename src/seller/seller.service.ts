import { Injectable, NotFoundException } from "@nestjs/common";
import { SellerDTO } from "./dtos/create-seller.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Seller } from './seller.entity'; // Import the entity

@Injectable()
export class SellerService {


  //private sellers: SellerDTO[] = [];

  constructor(@InjectRepository(Seller) private sellerRepository: Repository<Seller>) {}

  
//------------database-------------




async createSeller(fullName: string, age: number): Promise<Seller> {
  const seller = new Seller();
  seller.fullName = fullName;
  seller.age = age;
  seller.status = 'active'; // Default is 'active'
  return await this.sellerRepository.save(seller);
}

//----data pass with dto ------

// async createSeller(data: SellerDTO): Promise<Seller> {
//   const newSeller = this.sellerRepository.create(data); // Create a new seller instance
//   return await this.sellerRepository.save(newSeller); // Save the seller to the database
// }


async updateStatus(id: number, status: 'active' | 'inactive'): Promise<Seller> {
  const seller = await this.sellerRepository.findOne({ where: { id } });
  if (seller) {
    seller.status = status;
    return await this.sellerRepository.save(seller);
  }else{

    throw new NotFoundException(`Seller with ID ${id} not found`);

  }
  //return null;
}

async getInactiveSellers(): Promise<Seller[]> {
  return await this.sellerRepository.find({ where: { status: 'inactive' } });
}

async getSellersOlderThan40(): Promise<Seller[]> {
  return await this.sellerRepository.createQueryBuilder('seller')
    .where('seller.age > :age', { age: 40 })
    .getMany();
}
  getProfile(): string {
    return "Seller Profile Page";
  }



  //-------------------------without database--------------
  
  // createSeller(data: SellerDTO): SellerDTO {
  //   const newSeller: SellerDTO = {
  //     name: data.name,
  //     email: data.email,
  //     nid: data.nid,
  //   };
  //   this.sellers.push(newSeller);
  //   return newSeller;
  // }



  
  // findAll(): SellerDTO[] {
  //   return this.sellers;
  // }


  async findAll(): Promise<Seller[]> {
    return await this.sellerRepository.find(); // Get all sellers
  }


//  getByNid(nid: string): SellerDTO | undefined {
//     return this.sellers.find(seller => seller.nid === nid);
//   }

// async getByNid(nid: string): Promise<Seller | null> {
//   return await this.sellerRepository.findOne({ where: { nid } }); // Find seller by NID
// }

}
