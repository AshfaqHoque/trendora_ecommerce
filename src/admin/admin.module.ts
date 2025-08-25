import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entites/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from '../mailer/mailer.module';
import { PendingAdminEntity } from './entites/pending-registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, PendingAdminEntity]),
    forwardRef(() => AuthModule),
    MailerModule, 
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
