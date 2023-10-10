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
import { ProjectSetSamplingService } from '../services/project-set-sampling.service';
import { CreateProjectSetSamplingDto } from '../dto/project-set-sampling.dto';
import { ProjectDetailService } from '../services/project_detail.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectSetSamplingController {
  constructor(
    private readonly projectSetSamplingService: ProjectSetSamplingService,
    private readonly projectDetailService: ProjectDetailService,
  ) {}

  @Post(':project_id/detail/:detail_id/set-sampling')
  async createShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectSetSamplingDto: CreateProjectSetSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    const sampling =
      await this.projectSetSamplingService.findProjectSetSamplingOne(detail_id);
    if (!sampling) {
      data = await this.projectSetSamplingService.createSetSampling(
        detail_id,
        createProjectSetSamplingDto,
        req.user.id,
        i18n,
      );
    } else {
      data = await this.projectSetSamplingService.updateProjectShipping(
        detail_id,
        sampling.id,
        createProjectSetSamplingDto,
        req.user.id,
        i18n,
      );
    }
    this.projectDetailService.updateIsSampling(
      detail_id,
      createProjectSetSamplingDto.is_sampling,
    );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/set-sampling')
  async updateSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectSetSamplingDto: CreateProjectSetSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    let data;
    const sampling =
      await this.projectSetSamplingService.findProjectSetSamplingOne(detail_id);
    if (!sampling) {
      data = await this.projectSetSamplingService.createSetSampling(
        detail_id,
        createProjectSetSamplingDto,
        req.user.id,
        i18n,
      );
    } else {
      data = await this.projectSetSamplingService.updateProjectShipping(
        detail_id,
        sampling.id,
        createProjectSetSamplingDto,
        req.user.id,
        i18n,
      );
    }
    this.projectDetailService.updateIsSampling(
      detail_id,
      createProjectSetSamplingDto.is_sampling,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/set-sampling')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectSetSamplingService.findProjectSetSamplingOne(
      detail_id,
    );
    return { data };
  }
}
