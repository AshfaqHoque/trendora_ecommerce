import { Controller, Post, Body } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('trigger')
  async triggerNotification(@Body() payload: { channel: string; event: string; data: any }) {
    await this.pusherService.triggerEvent(payload.channel, payload.event, payload.data);
    return { message: 'Event triggered' };
  }
}
