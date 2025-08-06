import { HttpException, HttpStatus } from '@nestjs/common';


export class SellerExceptionName extends HttpException {
  constructor(message: string = 'Name must only contain alphabetic characters') {
    // Pass the message and status code to the HttpException constructor
    super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST);
   // throw new SellerCustomExceptionFilter
  }
}


export class SellerExceptionEmail extends HttpException {
    constructor(message: string = 'Mail must contain "@" and end with .xyz domain') {
      
      super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST);
    }
  }



export class SellerExceptionNid extends HttpException {
    constructor(message: string = 'NID must be a number with at least 10 digits') {

      super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST);
    }
  }
