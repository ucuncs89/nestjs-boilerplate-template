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
import { ProjectPriceDto } from '../dto/project-price.dto';
import { ProjectDetailService } from '../services/project_detail.service';
import { ProjectConfirmDto } from '../dto/project-confirm.dto';
import { ProjectService } from '../services/project.service';
import { ProjectMaterialService } from '../services/project_material.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectConfirmReviewController {
  constructor(
    private readonly projectDetailService: ProjectDetailService,
    private readonly projectService: ProjectService,
    private readonly projectMaterialService: ProjectMaterialService,
  ) {}

  @Post(':project_id/detail/:detail_id/confirmation')
  async createConfirm(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectConfirmDto: ProjectConfirmDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDetailService.updateIsConfirm(
      project_id,
      detail_id,
      projectConfirmDto,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/size-quality')
  async getSizeQuality(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectService.findSize(project_id);
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/material')
  async getMaterial(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findByProjectDetail(
      project_id,
      detail_id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/variant')
  async getVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    // const data = await this.projectMaterialService.findByProjectDetail(
    //   project_id,
    //   detail_id,
    // );
    return { data: 'ini belum' };
  }
}
