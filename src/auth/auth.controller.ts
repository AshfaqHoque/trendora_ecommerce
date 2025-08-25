import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/admin/login')
    async loginAdmin(@Body() loginAdminDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginAdmin(loginAdminDto, res);
    }

    @Post('/vendor/login')
    async loginVendor(@Body() loginAdminDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginVendor(loginAdminDto, res);
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logoutAdmin(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

}
