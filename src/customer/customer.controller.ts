import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
// import { CreateCustomerDto } from './dto/createCustomer.dto';
import { CreateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // create(@Body() body: any) {
  //   return this.customerService.create(body);
  // }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.customerService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
   
    return {
      message: 'User created',
      data: createCustomerDto,
    };
  }
}
