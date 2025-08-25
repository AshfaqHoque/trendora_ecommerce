import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
    constructor(private readonly mailerService: NestMailerService) {}

    async sendWelcomeEmail(to: string) {
        await this.mailerService.sendMail({
            to: to,
            subject: 'Welcome to Trendora!',
            text: 'Thank you for joining Trendora. We’re excited to have you!',
        });
        return { message: 'Email sent successfully' };
    }

    async sendOtpEmail(to: string, otp: string) {
        await this.mailerService.sendMail({
            to: to,
            subject: 'Verify Your Email - Trendora Admin Registration',
            text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
        });
        return { message: 'Email sent successfully' };
    }

}
