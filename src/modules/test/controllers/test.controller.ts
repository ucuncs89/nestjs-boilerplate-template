import { Controller, Get } from '@nestjs/common';

import { TestService } from '../services/test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get()
  async findAll() {
    const data = await this.testService.findAll();
    return { message: 'Successfully', data };
  }
}
