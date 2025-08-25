import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true, 
        secure: true,
        auth: {
          user: 'ashfaqhoq27@gmail.com',
          pass: 'csquabkvscccwpbm',
        },
      },
      // defaults: {
      //   from: '"Trendora E-commerce" <ashfaqhoq27@gmail.com>',
      // },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
