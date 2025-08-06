import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SellerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let protocol = req.protocol;  // http or https
    let host = req.get("host");   // Host of the request (e.g., localhost or domain)
    let url = req.originalUrl;    // The full URL of the request
    let method = req.method;      // The HTTP method (GET, POST, etc.)
    let date = new Date().toDateString(); // The current date

    console.log(protocol+"://"+host+url+" "+method+" "+date)

    next();
  }
}
