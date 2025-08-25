import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { VendorService } from 'src/vendor/vendor.service';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private adminService: AdminService, 
        private vendorService: VendorService,
        private jwtService: JwtService
    ) {}

    async loginAdmin(loginAdminDto: LoginDto, response: Response): Promise<{ message: string }> {
        const admin = await this.adminService.findOneByEmail(loginAdminDto.email);
        if (!admin || !(await bcrypt.compare(loginAdminDto.password, admin.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload = { id: admin.id, email: admin.email, role: Role.Admin };
        const token = await this.jwtService.signAsync(payload);
        
        this.setCookie(response, token);
        return { message: 'Admin login successful' };
    }

    async loginVendor(loginVendorDto: LoginDto, response: Response): Promise<{ message: string }> {
        const vendor = await this.vendorService.findOneByEmail(loginVendorDto.email);
        if (!vendor || !(await bcrypt.compare(loginVendorDto.password, vendor.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload = { id: vendor.id, email: vendor.email, role: Role.Vendor };
        const token = await this.jwtService.signAsync(payload);
        
        this.setCookie(response, token);
        return { message: 'Vendor login successful' };
    }

    private setCookie(response: Response, token: string) {
        response.cookie('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
    }

    async logout(response: Response): Promise<{ message: string }> {
        response.clearCookie('auth-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return { message: 'Logout successful' };
    }
}




    // async login(loginAdminDto: LoginAdminDto): Promise<{ access_token: string }> {
    //     const admin = await this.adminService.findOneByEmail(loginAdminDto.email);
    //     if (!admin || !(await bcrypt.compare(loginAdminDto.password, admin.password))) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     const payload = { email: admin.email, sub: admin.id };

    //     return{access_token: await this.jwtService.signAsync(payload)}; 
    // }

    // async logout(token: string): Promise<{ message: string }> {
    //     try {
    //         const payload = await this.jwtService.verifyAsync(token);
    //         this.tokenBlacklist.add(token);
    //         return { message: 'Successfully logged out' };

    //     } catch (error) {
    //         throw new UnauthorizedException('Invalid token');
    //     }
    // }

    // async isTokenBlacklisted(token: string): Promise<boolean> {
    //     return this.tokenBlacklist.has(token);
    // }

