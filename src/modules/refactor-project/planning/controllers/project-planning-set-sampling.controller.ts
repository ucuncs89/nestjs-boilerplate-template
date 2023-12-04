import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../../general/services/project-detail.service';
import { ProjectPlanningSetSamplingService } from '../services/project-planning-set-sampling.service';
import { CreateProjectPlanningSetSamplingDto } from '../dto/project-planning-set-sampling.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningSetSamplingController {
  constructor(
    private readonly projectPlanningSetSamplingService: ProjectPlanningSetSamplingService,
    private readonly projectDetailService: ProjectDetailService,
  ) {}

  @Post(':project_id/detail/:detail_id/set-sampling')
  async createSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    createProjectPlanningSetSamplingDto: CreateProjectPlanningSetSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    const sampling =
      await this.projectPlanningSetSamplingService.findProjectSetSamplingOne(
        detail_id,
      );
    if (!sampling) {
      data = await this.projectPlanningSetSamplingService.createSetSampling(
        detail_id,
        createProjectPlanningSetSamplingDto,
        req.user.id,
        i18n,
      );
    } else {
      data =
        await this.projectPlanningSetSamplingService.updateProjectSetSampling(
          detail_id,
          sampling.id,
          createProjectPlanningSetSamplingDto,
          req.user.id,
          i18n,
        );
    }
    this.projectDetailService.updateIsSampling(
      detail_id,
      createProjectPlanningSetSamplingDto.is_sampling,
    );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/set-sampling')
  async updateSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    createProjectPlanningSetSamplingDto: CreateProjectPlanningSetSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    let data;
    const sampling =
      await this.projectPlanningSetSamplingService.findProjectSetSamplingOne(
        detail_id,
      );
    if (!sampling) {
      data = await this.projectPlanningSetSamplingService.createSetSampling(
        detail_id,
        createProjectPlanningSetSamplingDto,
        req.user.id,
        i18n,
      );
    } else {
      data =
        await this.projectPlanningSetSamplingService.updateProjectSetSampling(
          detail_id,
          sampling.id,
          createProjectPlanningSetSamplingDto,
          req.user.id,
          i18n,
        );
    }
    this.projectDetailService.updateIsSampling(
      detail_id,
      createProjectPlanningSetSamplingDto.is_sampling,
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
    const data =
      await this.projectPlanningSetSamplingService.findProjectSetSamplingOne(
        detail_id,
      );
    return { data };
  }
}
