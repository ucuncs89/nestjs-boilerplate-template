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
import { ProjectVendorProductionService } from '../services/project-vendor-production.service';
import {
  ProjectVendorProductionDetailDto,
  ProjectVendorProductionDto,
  ProjectVendorProductionLossDto,
  ProjectVendorProductionLossPercentageDto,
} from '../dto/project-vendor-production.dto';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorProductionController {
  constructor(
    private readonly projectVendorProductionService: ProjectVendorProductionService,
  ) {}

  @Post(':project_id/detail/:detail_id/vendor-production-activity')
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectVendorProductionDto: ProjectVendorProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionService.createVendorProductionActivity(
        detail_id,
        projectVendorProductionDto,
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
    const data = await this.projectVendorProductionService.findVendorProduction(
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
      await this.projectVendorProductionService.removeVendorProductionActivity(
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
    @Body() projectVendorProductionDetailDto: ProjectVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionService.createVendorProduction(
        detail_id,
        project_vendor_id,
        projectVendorProductionDetailDto,
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
    @Body() projectVendorProductionDetailDto: ProjectVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectVendorProductionDetailDto,
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
      await this.projectVendorProductionService.deleteVendorProductionDetail(
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
    projectVendorProductionLossDto: ProjectVendorProductionLossDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVendorProductionService.updateLossPercentage(
      detail_id,
      projectVendorProductionLossDto.vendor,
      req.user.id,
      i18n,
    );
    return { data };
  }
}
