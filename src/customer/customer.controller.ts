import { Controller, Post, Body, Put, Param, Get, Delete, Request, ParseUUIDPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './customer.dto';
import { CustomerEntity } from './customer.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

    @Get()
    findAll() {
      return this.customerService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.customerService.findOne(id);
    }
  
    @Post('create')
    create(@Body()createCustomerDto:CreateCustomerDto) {
      return this.customerService.create(createCustomerDto);
    }
  
    // @Put('update')
    // update(@Request() req, @Body()CreateCustomerDto:CreateCustomerDto): Promise<CustomerEntity> {
    //   return this.customerService.update(req,CreateCustomerDto);
    // }
    
    @Delete('delete-my-id')
    @Roles(Role.Customer)
    removeMyId(@Request() req) {
      return this.customerService.remove(undefined, req.user);
    }

    @Delete('delete-customer/:id')
    @Roles(Role.Admin)
    removeCustomer(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
      return this.customerService.remove(id, req.user);
    }

}
