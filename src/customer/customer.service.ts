import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<CustomerEntity[]> {
      return this.customerRepository.find();
    }
  
  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({where: { id }});

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findOneByEmail(email: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOneBy({ email });
    if (!customer) throw new NotFoundException(`Customer with email ${email} not found`);
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<{ message: string; customer: Partial<CustomerEntity>}> {
    if (await this.customerRepository.findOne({where: { email: createCustomerDto.email }})) {
      throw new ConflictException('customer with this email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createCustomerDto.password, salt);
    const customerData = {...createCustomerDto,password: hashedPassword};
    const newcustomer = await this.customerRepository.save(customerData);
    return { message: 'customer created successfully', customer: newcustomer};
  }

  async remove(id: number | undefined, user: any): Promise<{ message: string }> {
    if (user.roles.includes(Role.Admin)) {
      if (!id) {
        throw new BadRequestException('Admin must provide customer ID to delete');
      }
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new NotFoundException(`customer with ID ${id} not found`);
      }
      await this.customerRepository.remove(customer);
      return { message: `customer with ID ${id} has been deleted successfully` };
    }
    if (user.roles.includes(Role.Customer)) {
      await this.customerRepository.delete({ id: user.id });
      return { message: 'Your account has been deleted successfully' };
    }
    throw new ForbiddenException('Access denied');
  }

  async countAll(): Promise<number> {
    return await this.customerRepository.count();
  }

  async getTotalCustomersPerYear() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const growthPercentage = await this.getCustomerYearOverYearGrowth(currentYear, previousYear);
  const totalCustomers = await this.getYearlyCustomers(currentYear);
  return {
    totalCustomers,
    customerGrowth: Math.round(growthPercentage * 100) / 100 // 2 decimal places
  };
}

async getCustomerYearOverYearGrowth(currentYear: number, previousYear: number) {
  const currentYearCustomers = await this.getYearlyCustomers(currentYear);
  const previousYearCustomers = await this.getYearlyCustomers(previousYear);

  if (previousYearCustomers === 0) return currentYearCustomers > 0 ? 100 : 0;
  
  return ((currentYearCustomers - previousYearCustomers) / previousYearCustomers) * 100;
}

async getYearlyCustomers(year: number): Promise<number> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const count = await this.customerRepository.count({
    where: {
      createdAt: Between(startDate, endDate)
    }
  });

  return count;
}


}
