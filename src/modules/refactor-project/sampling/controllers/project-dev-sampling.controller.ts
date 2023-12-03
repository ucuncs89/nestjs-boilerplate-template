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
  ProjectSamplingDevSamplingDto,
  ProjectSamplingSamplingRevisiDto,
} from '../dto/project-sampling-dev-sampling.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/sampling')
export class ProjectDevSamplingController {
  constructor(
    private readonly projectDevSamplingService: ProjectDevSamplingService,
  ) {}

  @Get(':project_id/detail/:detail_id/dev-sampling')
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
    ':project_id/detail/:detail_id/dev-sampling/:sampling_id/status/:status_id',
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
  @Put(':project_id/detail/:detail_id/dev-sampling/:sampling_id')
  async putSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Body() projectDevSamplingDto: ProjectSamplingDevSamplingDto,
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
  @Post(':project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi')
  async createRevisi(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Body() projectSamplingRevisiDto: ProjectSamplingSamplingRevisiDto,
  ) {
    const data = await this.projectDevSamplingService.createRevisiSampling(
      sampling_id,
      projectSamplingRevisiDto,
      req.user.id,
    );
    return { data };
  }
  @Put(
    ':project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi/:revisi_id',
  )
  async updateRevisi(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('sampling_id') sampling_id: number,
    @Param('revisi_id') revisi_id: number,
    @Body() projectSamplingRevisiDto: ProjectSamplingSamplingRevisiDto,
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
    ':project_id/detail/:detail_id/dev-sampling/:sampling_id/revisi/:revisi_id',
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
