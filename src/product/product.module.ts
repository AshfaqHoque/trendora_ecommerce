import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VendorEntity } from 'src/vendor/vendor.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProductEntity, VendorEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
