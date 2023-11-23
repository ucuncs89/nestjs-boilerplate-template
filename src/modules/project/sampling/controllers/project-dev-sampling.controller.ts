import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
  Put,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDevSamplingService } from '../services/project-dev-sampling.service';
import {
  ProjectDevSamplingDto,
  ProjectSamplingRevisiDto,
} from '../dto/project-dev-sampling.dto';

@ApiBearerAuth()
@ApiTags('Project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectDevSamplingController {
  constructor(
    private readonly projectDevSamplingService: ProjectDevSamplingService,
  ) {}

  @Get('sampling/:project_id/detail/:detail_id/dev-sampling')
  async getSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const findSampling = await this.projectDevSamplingService.findSampling(
      detail_id,
    );
    if (!findSampling) {
      const data = await this.projectDevSamplingService.generateDevSampling(
        detail_id,
        req.user.id,
      );
      return { data };
    } else {
      return { data: findSampling };
    }
  }

  @Put(
    'sampling/:project_id/detail/:detail_id/dev-sampling/:sampling_id/status/:status_id',
  )
  async putSamplingStatus(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Param('status_id') status_id: number,
    @Query('is_validate') is_validate: boolean,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDevSamplingService.updateSamplingStatus(
      sampling_id,
      status_id,
      is_validate,
      req.user.id,
    );
    return { data };
  }
  @Put('sampling/:project_id/detail/:detail_id/dev-sampling/:sampling_id')
  async putSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Body() projectDevSamplingDto: ProjectDevSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDevSamplingService.updateDevSampling(
      detail_id,
      sampling_id,
      projectDevSamplingDto,
      req.user.id,
    );
    return { data };
  }
  @Post(
    'sampling/:project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi',
  )
  async createRevisi(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Body() projectSamplingRevisiDto: ProjectSamplingRevisiDto,
  ) {
    const data = await this.projectDevSamplingService.createRevisiSampling(
      sampling_id,
      projectSamplingRevisiDto,
      req.user.id,
    );
    return { data };
  }
  @Put(
    'sampling/:project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi/:revisi_id',
  )
  async updateRevisi(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Param('revisi_id') revisi_id: number,
    @Body() projectSamplingRevisiDto: ProjectSamplingRevisiDto,
  ) {
    const data = await this.projectDevSamplingService.updateRevisiSampling(
      sampling_id,
      revisi_id,
      projectSamplingRevisiDto,
      req.user.id,
    );
    return { data };
  }
  @Delete(
    'sampling/:project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi/:revisi_id',
  )
  async deleteRevisi(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Param('revisi_id') revisi_id: number,
  ) {
    const data = await this.projectDevSamplingService.deleteRevisiSampling(
      sampling_id,
      revisi_id,
      req.user.id,
    );
    return { data };
  }
}
