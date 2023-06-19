import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('cloami_rmq') private client: ClientProxy) {}

  async getHello() {
    return this.client.send({ cmd: 'greeting' }, 'wildan');
  }

  async getHelloAsync() {
    const message = await this.client.send(
      { cmd: 'greeting-async' },
      'Progressive Coder',
    );
    return message;
  }

  async publishEvent() {
    this.client.emit('book-created', {
      bookName: 'Harry Potter',
      author: 'Brandon Sanderson',
    });
  }
}
