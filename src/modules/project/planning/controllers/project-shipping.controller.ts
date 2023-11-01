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
import { CreateProjectShippingDto } from '../dto/project-shipping.dto';
import { ProjectShippingService } from '../services/project-shipping.service';

@ApiBearerAuth()
@ApiTags('Project Planning')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectShippingController {
  constructor(
    private readonly projectShippingService: ProjectShippingService,
  ) {}

  @Post(':project_id/detail/:detail_id/shipping')
  async createShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectShippingDto: CreateProjectShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingService.createShipping(
      detail_id,
      createProjectShippingDto,
      req.user.id,
      i18n,
    );

    return { data };
  }
  @Put(':project_id/detail/:detail_id/shipping')
  async updateShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectShippingDto: CreateProjectShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingService.updateProjectShipping(
      detail_id,
      createProjectShippingDto,
      req.user.id,
      i18n,
    );

    return { data };
  }

  @Get(':project_id/detail/:detail_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingService.findProjectShipping(
      detail_id,
    );

    return { data };
  }
}
