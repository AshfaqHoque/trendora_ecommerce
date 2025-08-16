import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto, UpdateStatusDto } from './admin.dto';
import { AdminEntity } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
@Injectable()
export class AdminService {
    constructor(@InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>){}

    findAll(): Promise<AdminEntity[]> {
        return this.adminRepository.find();
    }

    async findOne(id: number): Promise<AdminEntity> {
        const admin = await this.adminRepository.findOneBy({id});
        if(!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
        return admin;
    }

    async create(createAdminDto: CreateAdminDto): Promise<{ message: string; admin: AdminEntity}> {
        const newAdmin = await this.adminRepository.save(createAdminDto);
        return { message: 'Admin created successfully', admin: newAdmin};
    }

    async update(id: number, updateAdminDto: UpdateAdminDto): Promise<{ message: string; admin: AdminEntity }> {
        const admin = await this.findOne(id);
        await this.adminRepository.update(id, updateAdminDto);
        return { message: 'Admin updated successfully', admin: { ...admin, ...updateAdminDto } };
    }

    async remove(id: number): Promise<{ message: string; admin: AdminEntity }> {
        const admin = await this.findOne(id);
        await this.adminRepository.delete(id);
        return { message: 'Admin deleted successfully', admin: admin };
    }

    async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<{message: string; admin: AdminEntity}> {
        const admin = await this.findOne(id);
        await this.adminRepository.update(id, {status: updateStatusDto.status});
        return { message: 'Status updated successfully', admin: { ...admin, ...updateStatusDto } };
    }

    findInactive(): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where:{status:'inactive'} });
    }

    findOlderThan(age: number): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where:{age: MoreThan(age)} });
    }
    
}
