import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    private admins: any[] = [];
    private idCounter = 1;

    findAll() {
        return this.admins;
    }

    create(admin: any) {
        admin.id = this.idCounter++;
        this.admins.push(admin);
        return { message: 'Admin created successfully', admin };
    }

    update(id: number, updatedAdmin: any) {
        const index = this.admins.findIndex(admin => admin.id === id);
        this.admins[index] = { ...this.admins[index], ...updatedAdmin, id };
        return { message: 'Admin updated successfully', admin: this.admins[index] };
    }

    remove(id: number) {
        const index = this.admins.findIndex(admin => admin.id === id);
        const removedAdmin = this.admins.splice(index, 1);
        return { message: 'Admin deleted successfully', admin: removedAdmin[0] };
    }
    
}
