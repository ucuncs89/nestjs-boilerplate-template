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
import { ProjectPlanningVendorProductionService } from '../services/project-planning-vendor-production.service';
import {
  ProjectPlanningVendorProductionDetailDto,
  ProjectPlanningVendorProductionDto,
  ProjectPlanningVendorProductionLossDto,
} from '../dto/project-planning-vendor-production.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningVendorProductionController {
  constructor(
    private readonly projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,

    private readonly projectService: ProjectService,
  ) {}

  @Post(':project_id/detail/:detail_id/vendor-production-activity')
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectPlanningVendorProductionDto: ProjectPlanningVendorProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const sumQuantity = await this.projectService.sumProjectSizeQuantity(
      project_id,
    );
    projectPlanningVendorProductionDto.quantity_unit_required = sumQuantity;
    const data =
      await this.projectPlanningVendorProductionService.createVendorProductionActivity(
        detail_id,
        projectPlanningVendorProductionDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/vendor-production')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.findVendorProduction(
        detail_id,
      );
    return { data };
  }

  @Delete(':project_id/detail/:detail_id/vendor-production/:project_vendor_id')
  async deleteVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.removeVendorProductionActivity(
        detail_id,
        project_vendor_id,
        req.user.id,
      );
    return { data };
  }

  @Post(
    ':project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail',
  )
  async createVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Body()
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.createVendorProduction(
        detail_id,
        project_vendor_id,
        projectPlanningVendorProductionDetailDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Put(
    ':project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectPlanningVendorProductionDetailDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Delete(
    ':project_id/detail/:detail_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
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
      await this.projectPlanningVendorProductionService.deleteVendorProductionDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
      );
    return { data };
  }

  @Put(
    ':project_id/detail/:detail_id/vendor-production-activity/loss-percentage',
  )
  async UpdateVendorProductionActivityLossPercentage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectPlanningVendorProductionLossDto: ProjectPlanningVendorProductionLossDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.updateLossPercentage(
        detail_id,
        projectPlanningVendorProductionLossDto.vendor,
        req.user.id,
        i18n,
      );
    return { data };
  }
}
