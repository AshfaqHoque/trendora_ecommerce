import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AdminModule, CustomerModule,SellerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
