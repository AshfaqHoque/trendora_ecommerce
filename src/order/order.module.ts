import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CustomerEntity } from 'src/customer/customer.entity';
import { OrderEntity } from './entites/order.entity';
import { OrderItemEntity } from './entites/order-item.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, CustomerEntity, ProductEntity, ]), AuthModule, NotificationsModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
