//middleware- only can change request
//interceptor-can change both request ans response


import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { map, tap } from 'rxjs/operators';


@Injectable()
export class SellerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    request.body.name = 'Face wash';
    request.body.category = "Skin care";

    return next.handle().pipe(map((data)=>{

        data="from interceptor";
        return data;
    }));
  }
}
