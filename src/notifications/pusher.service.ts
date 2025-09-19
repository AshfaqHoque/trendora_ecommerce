import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '2051588',
      key: '1ebefc9f9bc59e78ec37',
      secret: 'ffeb78bca92e77418519',
      cluster: 'ap2',
      useTLS: true,
    });
  }

  async triggerEvent(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
