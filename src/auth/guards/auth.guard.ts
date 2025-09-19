import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);

        if (!token) throw new UnauthorizedException('No authentication cookie found');

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
            request.user = {id: payload.id, email: payload.email, roles: [payload.role]};
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromCookie(request: any): string | undefined {
        return request.cookies?.['auth-token'];
    }

}