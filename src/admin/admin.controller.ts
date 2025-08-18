import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Patch, Session, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto, UpdatePasswordDto, UpdateStatusDto } from './admin.dto';
import { SessionGuard } from './session.guard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('send-mail')
    sendMail(@Query('email') email: string) {
        return this.adminService.sendWelcomeEmail(email);
    }

    @UseGuards(SessionGuard)
    @Get() 
    getAllAdmins() {
        return this.adminService.findAll();
    }

    @UseGuards(SessionGuard)
    @Get(':id') 
    getOneAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.findOne(id);
    }

    @Post() 
    createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @UseGuards(SessionGuard)
    @Put(':id')
    updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto) {
        return this.adminService.update(id, updateAdminDto);
    }
    
    @UseGuards(SessionGuard)
    @Delete(':id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }

    @UseGuards(SessionGuard)
    @Patch(':id/update-status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
        return this.adminService.updateStatus(id, updateStatusDto);
    }

    @UseGuards(SessionGuard)
    @Patch(':id/update-password')
    updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.adminService.updatePassword(id, updatePasswordDto);
    }

    @UseGuards(SessionGuard)
    @Get('find/inactive')
    getInactiveAdmins() {
        return this.adminService.findInactive();
    }

    @UseGuards(SessionGuard)
    @Get('find/olderthan/:age')
    getAdminsOlderThan(@Param('age', ParseIntPipe) age: number) {
        return this.adminService.findOlderThan(age);
    }   

    @Post('/login')
    loginAdmin(@Session() session, @Body() loginAdminDto:LoginAdminDto) {
        return this.adminService.login(session, loginAdminDto);
    }

    @Post('/logout')
    logoutAdmin(@Session() session) {
        return this.adminService.logout(session);
    }
}
