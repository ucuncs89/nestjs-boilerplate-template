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
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

import { ProjectService } from '../../general/services/project.service';
import { ProjectVendorProductionSamplingService } from '../services/project-vendor-production-sampling.service';
import {
  ProjectVendorProductionDetailSamplingDto,
  ProjectVendorProductionLossSamplingDto,
  ProjectVendorProductionSamplingDto,
} from '../dto/project-vendor-production-sampling.dto';

@ApiBearerAuth()
@ApiTags('Project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorProductionSamplingController {
  constructor(
    private readonly projectVendorProductionSamplingService: ProjectVendorProductionSamplingService,

    private readonly projectService: ProjectService,
  ) {}

  @Post('sampling/:project_id/detail/:detail_id/vendor-production-activity')
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectVendorProductionSamplingDto: ProjectVendorProductionSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const sumQuantity = await this.projectService.sumProjectSizeQuantity(
      project_id,
    );
    projectVendorProductionSamplingDto.quantity_unit_required = sumQuantity;
    const data =
      await this.projectVendorProductionSamplingService.createVendorProductionActivity(
        detail_id,
        projectVendorProductionSamplingDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Get('sampling/:project_id/detail/:detail_id/vendor-production')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.findVendorProduction(
        detail_id,
      );
    return { data };
  }

  @Delete(
    'sampling/:project_id/detail/:detail_id/vendor-production/:project_vendor_id',
  )
  async deleteVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.removeVendorProductionActivity(
        detail_id,
        project_vendor_id,
        req.user.id,
      );
    return { data };
  }

  @Post(
    'sampling/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail',
  )
  async createVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Body()
    projectVendorProductionDetailSamplingDto: ProjectVendorProductionDetailSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.createVendorProduction(
        detail_id,
        project_vendor_id,
        projectVendorProductionDetailSamplingDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Put(
    'sampling/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectVendorProductionDetailSamplingDto: ProjectVendorProductionDetailSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectVendorProductionDetailSamplingDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Delete(
    'sampling/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async deleteVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.deleteVendorProductionDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
      );
    return { data };
  }

  @Put(
    'sampling/:project_id/detail/:detail_id/vendor-production-activity/loss-percentage',
  )
  async UpdateVendorProductionActivityLossPercentage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectVendorProductionLossSamplingDto: ProjectVendorProductionLossSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionSamplingService.updateLossPercentage(
        detail_id,
        projectVendorProductionLossSamplingDto.vendor,
        req.user.id,
        i18n,
      );
    return { data };
  }
}
