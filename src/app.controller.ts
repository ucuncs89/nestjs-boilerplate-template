import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/greeting')
  async getHello() {
    const data = this.appService.getHello();
    return { data };
  }

  @Get('/greeting-async')
  async getHelloAsync() {
    return this.appService.getHelloAsync();
  }

  @Get('/publish-event')
  async publishEvent() {
    this.appService.publishEvent();
  }
}
