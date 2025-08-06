import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class SellerGuard implements CanActivate {
    private validUsername: string = "sellerUser";  // Example username
    private validPassword: string = "password123";  // Example password

    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        const username = request.header("username");
        const password = request.header("password");

        if (!username || !password) {
            return false;
        }

        // Check if username and password match
        return username === this.validUsername && password === this.validPassword;
    }
}
