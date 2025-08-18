import { Injectable, NotFoundException, Session, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto, UpdatePasswordDto, UpdateStatusDto } from './admin.dto';
import { AdminEntity } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
        private readonly mailerService: MailerService,
    ){}

    async findAll(): Promise<AdminEntity[]> {
        return await this.adminRepository.find();
    }

    async findOne(id: number): Promise<AdminEntity> {
        const admin = await this.adminRepository.findOneBy({id});
        if(!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
        return admin;
    }

    async create(createAdminDto: CreateAdminDto): Promise<{ message: string; admin: AdminEntity}> {
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(createAdminDto.password, salt);
        createAdminDto.password = hashedPass;
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
    
    async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<{message: string}> {
        const admin = await this.findOne(id);
        const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, admin.password);
        if(!isMatch) throw new Error('old passsword is incorrect');
        const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        admin.password = hashedPassword;
        await this.adminRepository.save(admin);

        // await this.mailerService.sendMail({
        //     to: admin.email,
        //     from: 'ashfaqhoq27@gmail.com',
        //     subject: 'Your password has been updated.',
        //     text: 'Hello, your password has been successfully updated.',
        //     html: `<p>Hello ${admin.fullName},</p><p>Your password has been successfully updated.</p>`,
        // }); 
        return { message: 'Password updated successfully' };
    }

    async sendWelcomeEmail(recieverEmail: string) {
        await this.mailerService.sendMail({
            to: recieverEmail,
            subject: 'Welcome to Trendora!',
            text: 'Thank you for joining Trendora. We’re excited to have you!',
        });
        return { message: 'Email sent successfully' };
    }

    async findInactive(): Promise<AdminEntity[]> {
        return await this.adminRepository.find({ where:{status:'inactive'} });
    }

    async findOlderThan(age: number): Promise<AdminEntity[]> {
        return await this.adminRepository.find({ where:{age: MoreThan(age)} });
    }

    async login(session, loginAdminDto: LoginAdminDto) {
        const admin = await this.adminRepository.findOneBy({email: loginAdminDto.email});
        if(!admin) throw new NotFoundException(`Admin not found`);
        const isMatch = await bcrypt.compare(loginAdminDto.password, admin.password);
        if(!isMatch) throw new UnauthorizedException('Invalid password');
        session.adminId = admin.id;
        return { message: 'Login successful', adminId: session.adminId };
    }

    async logout(session) {
        if(!session.adminId) throw new UnauthorizedException('You are not logged in');
        session.destroy((err) => {if(err) throw new Error('Failed to logout');});
        return {message: 'Logout succcessful'};
    }
    
}
