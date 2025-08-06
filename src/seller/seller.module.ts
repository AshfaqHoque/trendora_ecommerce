// src/seller/seller.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller } from './seller.entity';
import { SellerMiddleware } from './middlewares/seller.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Seller]),],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SellerMiddleware).forRoutes('seller')
  }
}
