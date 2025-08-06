import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { SellerExceptionEmail, SellerExceptionName } from '../exceptions/seller.exception';


@Injectable()
export class SellerPipeName implements PipeTransform {
  transform(value: any) {
    // Validate 'name' to ensure it only contains alphabets (A-Z, a-z)
    if (typeof value.name !== 'string' || !/^[A-Za-z]+$/.test(value.name)) {
      //throw new BadRequestException('Name must only contain alphabetic characters');
      //custom exception
      throw new SellerExceptionName();
  
    }
    return value; 
  }
}

@Injectable()
export class SellerPipeEmail implements PipeTransform {
  transform(value: any) {
    // Validate 'email' to ensure it contains @ and ends with .xyz domain
    if (typeof value.email !== 'string' || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.xyz$/.test(value.email)) {
     // throw new BadRequestException('Email must contain "@" and end with .xyz domain');
     //custom exception
     throw new SellerExceptionEmail();
    }
    return value;
  }
}

@Injectable()
export class SellerPipeNid implements PipeTransform {
  transform(value: any) {
    // Validate 'nid' to ensure it's a string and has at least 10 digits
    if (typeof value.nid !== 'string' || !/^\d{10,}$/.test(value.nid)) {
      //throw new BadRequestException('NID must be a number with at least 10 digits');
      //custom exception
      throw new SellerExceptionEmail();
    }
    return value;
  }
}

