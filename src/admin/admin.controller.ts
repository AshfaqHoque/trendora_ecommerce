import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Get() 
    getAllAdmins() {
        return this.adminService.findAll();
    }
    @Post('addadmin') 
    createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }
    @Put('updateadmin/:id')
    updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto,) {
        return this.adminService.update(id, updateAdminDto);
    }
    @Delete('deleteadmin/:id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }
}
