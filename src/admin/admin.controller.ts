import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Get() // GET /admin
    getAllAdmins() {
        return this.adminService.findAll();
    }
    @Post() // POST /admin
    createAdmin(@Body() body: any) {
        return this.adminService.create(body);
    }
    @Put(':id')
    updateAdmin(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
    ) {
        return this.adminService.update(id, body);
    }

    @Delete(':id')
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.remove(id);
    }
}
