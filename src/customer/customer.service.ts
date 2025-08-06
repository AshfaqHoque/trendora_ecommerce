import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {}

  async createCustomer(dto: CreateCustomerDto): Promise<CustomerEntity> {

  const customer = this.customerRepo.create(dto);
  return await this.customerRepo.save(customer);
}

  async updatePhone(id: string, newPhone: number): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) throw new NotFoundException('Customer not found');

    customer.phone = newPhone;
    return await this.customerRepo.save(customer);
  }

  async getCustomersWithNullFullName(): Promise<CustomerEntity[]> {
    return await this.customerRepo.find({ where: { fullName: IsNull() } });
  }

  async removeCustomer(id: string): Promise<string> {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Customer not found');
    return `Customer with ID ${id} deleted successfully.`;
  }
}
