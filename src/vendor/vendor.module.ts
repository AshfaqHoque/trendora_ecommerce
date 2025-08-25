import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './vendor.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  providers: [VendorService],
  controllers: [VendorController],
  exports: [VendorService], 
})
export class VendorModule {}
