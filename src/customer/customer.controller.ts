import { Controller, Post, Body, Put, Param, Get, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
//import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateCustomerDto } from './customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.createCustomer(dto);
  }

  @Put(':id/phone')
  updatePhone(@Param('id') id: string, @Body('phone') phone: number) {
    return this.customerService.updatePhone(id, phone);
  }

  @Get('null-fullname')
  getNullFullNames() {
    return this.customerService.getCustomersWithNullFullName();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.customerService.removeCustomer(id);
  }
}
