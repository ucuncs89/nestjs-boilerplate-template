import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPriceService } from '../services/project-price.service';
import { ProjectPriceDto } from '../dto/project-price.dto';

@ApiBearerAuth()
@ApiTags('Project Planning')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectPriceController {
  constructor(private readonly projectPriceService: ProjectPriceService) {}

  @Post(':project_id/detail/:detail_id/price')
  async createSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectPriceDto: ProjectPriceDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    const price = await this.projectPriceService.findProjectPrice(detail_id);
    if (!price) {
      data = await this.projectPriceService.createProjectPrice(
        detail_id,
        projectPriceDto,
        req.user.id,
        i18n,
      );
    } else {
      data = await this.projectPriceService.updateProjectPrice(
        price.id,
        projectPriceDto,
        req.user.id,
        i18n,
      );
    }
    return { data };
  }

  @Put(':project_id/detail/:detail_id/price')
  async updateSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectPriceDto: ProjectPriceDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    const price = await this.projectPriceService.findProjectPrice(detail_id);
    if (!price) {
      data = await this.projectPriceService.createProjectPrice(
        detail_id,
        projectPriceDto,
        req.user.id,
        i18n,
      );
    } else {
      data = await this.projectPriceService.updateProjectPrice(
        price.id,
        projectPriceDto,
        req.user.id,
        i18n,
      );
    }
    return { data };
  }

  @Get(':project_id/detail/:detail_id/price')
  async findPrice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPriceService.findProjectPrice(detail_id);
    return { data };
  }
}
