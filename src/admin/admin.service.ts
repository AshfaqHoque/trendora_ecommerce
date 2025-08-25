import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto, UpdateStatusDto, VerifyEmailDto, } from './admin.dto';
import { AdminEntity } from './entites/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';
import { PendingAdminEntity } from './entites/pending-registration.entity';

// interface PendingRegistration {
//     admin: CreateAdminDto;
//     otp: string;
//     expiresAt: Date;
// }
@Injectable()
export class AdminService {
    //private pendingRegistrations = new Map<string, PendingRegistration>();
    constructor(
        @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
        @InjectRepository(PendingAdminEntity) private pendingRepository: Repository<PendingAdminEntity>,
        private readonly mailerService: MailerService,
    ){}

    async findAll(): Promise<AdminEntity[]> {
        return await this.adminRepository.find();
    }

    async findOneById(id: number): Promise<AdminEntity> {
        const admin = await this.adminRepository.findOneBy({id});
        if(!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
        return admin;
    }

    async findOneByEmail(email: string): Promise<AdminEntity> {
        const admin = await this.adminRepository.findOneBy({ email });
        if (!admin) throw new NotFoundException(`Admin with email ${email} not found`);
        return admin;
    }

    private generateOtp(): string {
        return Math.floor(100 + Math.random() * 900).toString();
    }

    async requestRegistration(createAdminDto: CreateAdminDto): Promise<{ message: string }> {
        const admin = await this.adminRepository.findOneBy({email:createAdminDto.email});
        if (admin) {
            throw new ConflictException('Admin with this email already exists');
        }

        await this.pendingRepository.delete({ expiresAt: LessThan(new Date()) });
        await this.pendingRepository.delete({ email: createAdminDto.email });

        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);

        await this.pendingRepository.save({
            fullName: createAdminDto.fullName,
            email: createAdminDto.email,
            age: createAdminDto.age,
            password: hashedPassword,
            linkedInUrl: createAdminDto.linkedInUrl,
            otp,
            expiresAt,
        });

        await this.mailerService.sendOtpEmail(createAdminDto.email, otp);

        return { message: 'OTP sent to your email. Please verify to complete registration.' };
    }

    async verifyEmailAndCreateAdmin(verifyEmailDto: VerifyEmailDto): Promise<{ message: string; admin: Partial<AdminEntity> }> {
        const pending = await this.pendingRepository.findOneBy({ email: verifyEmailDto.email });
        if (!pending) {
            throw new BadRequestException('No pending registration found for this email');
        }
        if (new Date() > pending.expiresAt) {
            throw new BadRequestException('OTP has expired. Please request a new one.');
        }
        if (pending.otp !== verifyEmailDto.otp) {
            throw new BadRequestException('Invalid OTP');
        }

        const newAdmin = await this.adminRepository.save({
            fullName: pending.fullName,
            email: pending.email,
            age: pending.age,
            password: pending.password, 
            linkedInUrl: pending.linkedInUrl,
        });

        await this.pendingRepository.delete({ email: verifyEmailDto.email });
        await this.mailerService.sendWelcomeEmail(newAdmin.email);

        const { password, ...adminWithoutPassword } = newAdmin;
        return { message: 'Admin registration completed successfully', admin: adminWithoutPassword };
    }


    // async create(createAdminDto: CreateAdminDto): Promise<{ message: string; admin: AdminEntity}> {
    //     const salt = await bcrypt.genSalt();
    //     const hashedPass = await bcrypt.hash(createAdminDto.password, salt);
    //     createAdminDto.password = hashedPass;
    //     const newAdmin = await this.adminRepository.save(createAdminDto);
    //     return { message: 'Admin created successfully', admin: newAdmin};
    // }

    async update(id: number, updateAdminDto: UpdateAdminDto): Promise<{ message: string; admin: AdminEntity }> {
        const admin = await this.findOneById(id);
        await this.adminRepository.update(id, updateAdminDto);
        return { message: 'Admin updated successfully', admin: { ...admin, ...updateAdminDto } };
    }

    async remove(id: number): Promise<{ message: string; admin: AdminEntity }> {
        const admin = await this.findOneById(id);
        await this.adminRepository.delete(id);
        return { message: 'Admin deleted successfully', admin: admin };
    }

    async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<{message: string; admin: AdminEntity}> {
        const admin = await this.findOneById(id);
        await this.adminRepository.update(id, {status: updateStatusDto.status});
        return { message: 'Status updated successfully', admin: { ...admin, ...updateStatusDto } };
    }
    
    async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<{message: string}> {
        const admin = await this.findOneById(id);
        const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, admin.password);
        if(!isMatch) throw new BadRequestException('old passsword is incorrect');
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

    // async sendWelcomeEmail(recieverEmail: string) {
    //     await this.mailerService.sendMail({
    //         to: recieverEmail,
    //         subject: 'Welcome to Trendora!',
    //         text: 'Thank you for joining Trendora. We’re excited to have you!',
    //     });
    //     return { message: 'Email sent successfully' };
    // }

    async findInactive(): Promise<AdminEntity[]> {
        return await this.adminRepository.find({ where:{status:'inactive'} });
    }

    async findOlderThan(age: number): Promise<AdminEntity[]> {
        return await this.adminRepository.find({ where:{age: MoreThan(age)} });
    }

    // async login(session, loginAdminDto: LoginAdminDto) {
    //     const admin = await this.adminRepository.findOneBy({email: loginAdminDto.email});
    //     if(!admin) throw new NotFoundException(`Admin not found`);
    //     const isMatch = await bcrypt.compare(loginAdminDto.password, admin.password);
    //     if(!isMatch) throw new UnauthorizedException('Invalid password');
    //     session.adminId = admin.id;
    //     return { message: 'Login successful', adminId: session.adminId };
    // }

    // async logout(session) {
    //     if(!session.adminId) throw new UnauthorizedException('You are not logged in');
    //     session.destroy((err) => {if(err) throw new Error('Failed to logout');});
    //     return {message: 'Logout succcessful'};
    // }
    
}
