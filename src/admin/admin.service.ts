import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto, UpdateStatusDto } from './admin.dto';
import { AdminEntity } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
@Injectable()
export class AdminService {
    constructor(@InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>){}

    async findAll(): Promise<AdminEntity[]> {
        return this.adminRepository.find();
    }

    async create(createAdminDto: CreateAdminDto): Promise<{ message: string; admin: AdminEntity}> {
        const newAdmin = await this.adminRepository.save(createAdminDto);
        return { message: 'Admin created successfully', admin: newAdmin};
    }

    async update(id: number, updateAdminDto: UpdateAdminDto): Promise<{ message: string; admin: AdminEntity }> {
        if (!(await this.adminRepository.findOneBy({id}))) throw new NotFoundException(`Admin ${id} not found`);
        await this.adminRepository.update(id, updateAdminDto);
        const updatedAdmin = await this.adminRepository.findOneBy({id});
        return { message: 'Admin updated successfully', admin: updatedAdmin! };
    }

    async remove(id: number): Promise<{ message: string; admin: AdminEntity }> {
        const admin = await this.adminRepository.findOneBy({id});
        if (!admin) throw new NotFoundException(`Admin ${id} not found`);
        await this.adminRepository.delete(id);
        return { message: 'Admin deleted successfully', admin: admin };
    }

    async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<{message: string; admin: AdminEntity}> {
        if (!(await this.adminRepository.findOneBy({id}))) throw new NotFoundException(`Admin ${id} not found`);
        await this.adminRepository.update(id, {status: updateStatusDto.status});
        const updatedAdmin = await this.adminRepository.findOneBy({id});
        return { message: 'Status updated successfully', admin: updatedAdmin! };
    }

    findInactive(): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where:{status:'inactive'} });
    }

    findOlderThan40(): Promise<AdminEntity[]> {
        return this.adminRepository.find({ where:{age: MoreThan(40)} });
    }
    
}
