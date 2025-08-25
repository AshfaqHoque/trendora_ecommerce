import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Patch, Session, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto, UpdateStatusDto, VerifyEmailDto } from './admin.dto';
//import { SessionGuard } from './session.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MailerService } from '../mailer/mailer.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly mailerService: MailerService,
    ) {}
    

    // @Post('send-welcome-mail')
    // sendMail(@Body('email') email: string) {
    //     return this.mailerService.sendWelcomeEmail(email);
    // }

    @UseGuards(AuthGuard)
    @Get() 
    getAllAdmins() {
        return this.adminService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id') 
    getOneAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.findOneById(id);
    }

    // @Post() 
    // createAdmin(@Body() createAdminDto: CreateAdminDto) {
    //     return this.adminService.create(createAdminDto);
    // }

    @Post('register')
    requestRegistration(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.requestRegistration(createAdminDto);
    }

    @Post('verify-email')
    verifyEmailAndCreateAdmin(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.adminService.verifyEmailAndCreateAdmin(verifyEmailDto);
    }


    @UseGuards(AuthGuard)
    @Put(':id')
    updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto) {
        return this.adminService.update(id, updateAdminDto);
    }
    
    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id/update-status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
        return this.adminService.updateStatus(id, updateStatusDto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id/update-password')
    updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.adminService.updatePassword(id, updatePasswordDto);
    }

    @UseGuards(AuthGuard)
    @Get('find/inactive')
    getInactiveAdmins() {
        return this.adminService.findInactive();
    }

    @UseGuards(AuthGuard)
    @Get('find/olderthan/:age')
    getAdminsOlderThan(@Param('age', ParseIntPipe) age: number) {
        return this.adminService.findOlderThan(age);
    }   

    // @Post('/login')
    // loginAdmin(@Body() loginAdminDto:LoginAdminDto) {
    //     return this.authService.login(loginAdminDto);
    // }

    // @Post('/logout')
    // logout() {
    //     return this.authService.logout();
    // }
}
