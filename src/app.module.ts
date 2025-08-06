import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AdminModule, CustomerModule, SellerModule, TypeOrmModule.forRoot(
  { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'trendora_ecommerce',
    autoLoadEntities: true,
    synchronize: true,
    // dropSchema: true,
  }), ProductModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
