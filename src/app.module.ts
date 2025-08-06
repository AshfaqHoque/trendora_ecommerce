import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {databaseConfig} from './seller/config/database.config';

@Module({
  imports: [AdminModule, UserModule,SellerModule,  TypeOrmModule.forRoot(databaseConfig())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
