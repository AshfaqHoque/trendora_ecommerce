import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
//import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [AdminModule, CustomerModule, SellerModule, ProductModule, VendorModule,
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
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     ignoreTLS: true, 
    //     secure: true,
    //     auth: {
    //       user: 'ashfaqhoq27@gmail.com',
    //       pass: 'csquabkvscccwpbm',
    //     },
    //   },
    //   // defaults: {
    //   //   from: '"Trendora E-commerce" <ashfaqhoq27@gmail.com>',
    //   // },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
