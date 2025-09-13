import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Role } from './enums/role.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/admin/login')
    async loginAdmin(@Body() loginAdminDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginAdminDto, res, Role.Admin);
    }

    @Post('/vendor/login')
    async loginVendor(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginDto, res, Role.Vendor);
    }

    @Post('/customer/login')
    async loginCustomer(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(loginDto, res, Role.Customer);
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logoutAdmin(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

}
