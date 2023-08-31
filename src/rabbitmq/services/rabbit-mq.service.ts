import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class RabbitMQService {
  constructor(@Inject('cloami_rmq') private readonly client: ClientProxy) {}
  async send(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }
}
