import { Controller, Get, Post, Param, Body, Put, Delete, Request, ParseIntPipe } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorEntity } from './vendor.entity';
import { CreateVendorDto } from './vendor.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  findAll(): Promise<VendorEntity[]> {
    return this.vendorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<VendorEntity> {
    return this.vendorService.findOne(id);
  }

  @Post('create')
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  // @Put('update')
  // update(@Request() req, @Body() createVendorDto: CreateVendorDto): Promise<VendorEntity> {
  //   return this.vendorService.update(req, createVendorDto);
  // }
  
  @Delete('delete-my-id')
  @Roles(Role.Vendor)
  removeMyId(@Request() req) {
    return this.vendorService.remove(undefined, req.user);
  }

  @Delete('delete-vendor/:id')
  @Roles(Role.Admin)
  removeVendor(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vendorService.remove(id, req.user);
  }
}
