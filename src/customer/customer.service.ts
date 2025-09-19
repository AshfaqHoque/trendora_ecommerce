import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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

}
