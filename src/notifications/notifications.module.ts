import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { PusherService } from './pusher.service';

@Module({
  controllers: [NotificationsController],
  providers: [PusherService],
  exports: [PusherService], 
})
export class NotificationsModule {}
