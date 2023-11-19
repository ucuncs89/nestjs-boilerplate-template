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
import { ProjectVendorProductionProductionService } from '../services/project-vendor-production-production.service';
import {
  ProjectVendorProductionDetailProductionDto,
  ProjectVendorProductionDetailProductionDueDateDto,
  ProjectVendorProductionLossProductionDto,
  ProjectVendorProductionProductionDto,
} from '../dto/project-vendor-production-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorProductionProductionController {
  constructor(
    private readonly projectVendorProductionProductionService: ProjectVendorProductionProductionService,

    private readonly projectService: ProjectService,
  ) {}

  @Post('production/:project_id/detail/:detail_id/vendor-production-activity')
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectVendorProductionProductionDto: ProjectVendorProductionProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const sumQuantity = await this.projectService.sumProjectSizeQuantity(
      project_id,
    );
    projectVendorProductionProductionDto.quantity_unit_required = sumQuantity;
    const data =
      await this.projectVendorProductionProductionService.createVendorProductionActivity(
        detail_id,
        projectVendorProductionProductionDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Get('production/:project_id/detail/:detail_id/vendor-production')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.findVendorProduction(
        detail_id,
      );
    return { data };
  }

  @Delete(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id',
  )
  async deleteVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.removeVendorProductionActivity(
        detail_id,
        project_vendor_id,
        req.user.id,
      );
    return { data };
  }

  @Post(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail',
  )
  async createVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Body()
    projectVendorProductionDetailProductionDto: ProjectVendorProductionDetailProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.createVendorProduction(
        detail_id,
        project_vendor_id,
        projectVendorProductionDetailProductionDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Put(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectVendorProductionDetailProductionDto: ProjectVendorProductionDetailProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectVendorProductionDetailProductionDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Delete(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
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
      await this.projectVendorProductionProductionService.deleteVendorProductionDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
      );
    return { data };
  }

  @Put(
    'production/:project_id/detail/:detail_id/vendor-production-activity/loss-percentage',
  )
  async UpdateVendorProductionActivityLossPercentage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectVendorProductionLossProductionDto: ProjectVendorProductionLossProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.updateLossPercentage(
        detail_id,
        projectVendorProductionLossProductionDto.vendor,
        req.user.id,
        i18n,
      );
    return { data };
  }
  @Put(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/due-date/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetailDueDate(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectVendorProductionDetailProductionDueDateDto: ProjectVendorProductionDetailProductionDueDateDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionProductionService.updateVendorProductionDueDate(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectVendorProductionDetailProductionDueDateDto,
        req.user.id,
        i18n,
      );
    return { data };
  }
}
