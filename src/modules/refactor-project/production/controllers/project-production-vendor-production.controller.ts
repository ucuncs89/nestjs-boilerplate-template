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
import { ProjectProductionVendorProductionService } from '../services/project-production-vendor-production.service';
import {
  ProjectProductionVendorProductionDetailDto,
  ProjectProductionVendorProductionDetailDueDateDto,
  ProjectProductionVendorProductionDto,
  ProjectProductionVendorProductionLossDto,
} from '../dto/project-production-vendor-production.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionVendorProductionController {
  constructor(
    private readonly projectProductionVendorProductionService: ProjectProductionVendorProductionService,

    private readonly projectService: ProjectService,
  ) {}

  @Post(':project_id/detail/:detail_id/vendor-production-activity')
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectProductionVendorProductionDto: ProjectProductionVendorProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const sumQuantity = await this.projectService.sumProjectSizeQuantity(
      project_id,
    );
    projectProductionVendorProductionDto.quantity_unit_required = sumQuantity;
    const data =
      await this.projectProductionVendorProductionService.createVendorProductionActivity(
        detail_id,
        projectProductionVendorProductionDto,
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
      await this.projectProductionVendorProductionService.findVendorProduction(
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
      await this.projectProductionVendorProductionService.removeVendorProductionActivity(
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
    projectProductionVendorProductionDetailDto: ProjectProductionVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorProductionService.createVendorProduction(
        detail_id,
        project_vendor_id,
        projectProductionVendorProductionDetailDto,
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
    projectProductionVendorProductionDetailDto: ProjectProductionVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorProductionService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectProductionVendorProductionDetailDto,
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
      await this.projectProductionVendorProductionService.deleteVendorProductionDetail(
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
    projectProductionVendorProductionLossDto: ProjectProductionVendorProductionLossDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorProductionService.updateLossPercentage(
        detail_id,
        projectProductionVendorProductionLossDto.vendor,
        req.user.id,
        i18n,
      );
    return { data };
  }
  @Put(
    ':project_id/detail/:detail_id/vendor-production/:project_vendor_id/due-date/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetailDueDate(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectProductionVendorProductionDetailDueDateDto: ProjectProductionVendorProductionDetailDueDateDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorProductionService.updateVendorProductionDueDate(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectProductionVendorProductionDetailDueDateDto,
        req.user.id,
        i18n,
      );
    return { data };
  }
}
