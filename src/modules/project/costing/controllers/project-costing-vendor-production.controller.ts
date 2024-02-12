import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectCostingVendorProductionService } from '../services/project-costing-vendor-production.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectCostingVendorProductionDetailDto } from '../dto/project-costing-vendor-production.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingVendorProductionController {
  constructor(
    private projectCostingVendorProductionService: ProjectCostingVendorProductionService,
  ) {}

  @Get(':project_id/vendor-production')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectCostingVendorProductionService.findVendorProduction(
        project_id,
      );
    return { data };
  }

  @Post(':project_id/vendor-production')
  async createVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectCostingVendorProductionDetailDto: ProjectCostingVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectCostingVendorProductionService.createVendorProduction(
        project_id,
        projectCostingVendorProductionDetailDto,
        req.user.id,
        i18n,
      );
    return { data };
  }

  @Put(
    ':project_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async updateVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
    @Body()
    projectCostingVendorProductionDetailDto: ProjectCostingVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectCostingVendorProductionService.updateVendorProduction(
        project_vendor_id,
        project_vendor_production_detail_id,
        projectCostingVendorProductionDetailDto,
        req.user.id,
        i18n,
        project_id,
      );
    return { data };
  }

  @Delete(
    ':project_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id',
  )
  async deleteVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
  ) {
    const data =
      await this.projectCostingVendorProductionService.deleteVendorProductionDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
        req.user.id,
        project_id,
      );
    return { data };
  }
}
