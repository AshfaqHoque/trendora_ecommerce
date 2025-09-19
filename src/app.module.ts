import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { VendorModule } from './vendor/vendor.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { NotificationsController } from './notifications/notifications.controller';
import { PusherService } from './notifications/pusher.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AdminModule, CustomerModule, ProductModule, VendorModule, MailerModule, OrderModule, NotificationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'trendora_ecommerce',
      autoLoadEntities: true,
      synchronize: true,
      //dropSchema: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
