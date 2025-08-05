import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, UpdateStatusDto } from './admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get() 
    getAllAdmins() {
        return this.adminService.findAll();
    }

    @Post() 
    createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @Put(':id')
    updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto,) {
        return this.adminService.update(id, updateAdminDto);
    }
    
    @Delete(':id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
        return this.adminService.updateStatus(id, updateStatusDto);
    }

    @Get('inactive')
    getInactiveAdmins() {
        return this.adminService.findInactive();
    }

    @Get('olderthan40')
    getAdminsOlderThan40() {
        return this.adminService.findOlderThan40();
    }
}
