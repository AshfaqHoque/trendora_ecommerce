import { Injectable } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { Admin } from './admin.entity';
@Injectable()
export class AdminService {
    private admins: Admin[] = [];

    findAll() {
        return this.admins;
    }

    create(createAdminDto: CreateAdminDto) {
        const newAdmin = {id: this.admins.length + 1, ...createAdminDto};
        this.admins.push(newAdmin);
        return { message: 'Admin created successfully', admin: newAdmin};
    }

    update(id: number, updatedAdminDto: UpdateAdminDto) {
        const index = this.admins.findIndex(admin => admin.id === id);
        this.admins[index] = { ...this.admins[index], ...updatedAdminDto};
        return { message: 'Admin updated successfully', admin: this.admins[index]};
    }

    remove(id: number) {
        const index = this.admins.findIndex(admin => admin.id === id);
        const removedAdmin = this.admins.splice(index, 1);
        return { message: 'Admin deleted successfully', admin: removedAdmin[0] };
    }
    
}
