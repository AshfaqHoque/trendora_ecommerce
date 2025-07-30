import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
    private users: any[] = [];

    create(data: any) {
        this.users.push(data);
        return { message: 'User created', data };
  }

    findAll() {
     return this.users;
  }

    findOne(id: number) {
        return this.users[id] ?? { message: 'User not found' };
  }

    update(id: number, data: any) {
        this.users[id] = data;
        return { message: 'User updated', data };
  }

    remove(id: number) {
        this.users.splice(id, 1);
        return { message: 'User removed' };
  }
}
