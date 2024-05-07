import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from '../services/home.service';
import { HomeDto } from '../dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getFindHome(@Query() query: HomeDto) {
    const data = await this.homeService.getFindHome(query);
    return { data };
  }
}
