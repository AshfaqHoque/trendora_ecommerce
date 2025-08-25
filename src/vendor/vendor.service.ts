import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { Role } from 'src/auth/enums/role.enum';
import { CreateVendorDto } from './vendor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
  ) {}

  async findAll(): Promise<VendorEntity[]> {
    return this.vendorRepository.find();
  }

  async findOne(id: number): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  async findOneByEmail(email: string): Promise<VendorEntity> {
    const vendor = await this.vendorRepository.findOneBy({ email });
    if (!vendor) throw new NotFoundException(`Admin with email ${email} not found`);
    return vendor;
  }

  async create(createVendorDto: CreateVendorDto): Promise<{ message: string; vendor: Partial<VendorEntity>}> {
    if (await this.vendorRepository.findOne({where: { email: createVendorDto.email }})) {
      throw new ConflictException('Vendor with this email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createVendorDto.password, salt);
    const vendorData = {...createVendorDto,password: hashedPassword};
    const newVendor = await this.vendorRepository.save(vendorData);
    const { password, ...vendorWithoutPassword } = newVendor;
    return { message: 'Vendor created successfully', vendor: vendorWithoutPassword};
  }

  // async update(id: number, data: Partial<VendorEntity>): Promise<VendorEntity> {
  //   const vendor = await this.findOne(id);
  //   Object.assign(vendor, data);
  //   return this.vendorRepository.save(vendor);
  // }

  async remove(id: number | undefined, user: any): Promise<{ message: string }> {
    if (user.roles.includes(Role.Admin)) {
      if (!id) {
        throw new BadRequestException('Admin must provide vendor ID to delete');
      }
      const vendor = await this.vendorRepository.findOne({ where: { id } });
      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }
      await this.vendorRepository.remove(vendor);
      return { message: `Vendor with ID ${id} has been deleted successfully` };
    }
    if (user.roles.includes(Role.Vendor)) {
      await this.vendorRepository.delete({ id: user.id });
      return { message: 'Your account has been deleted successfully' };
    }
    throw new ForbiddenException('Access denied');
  }
}
