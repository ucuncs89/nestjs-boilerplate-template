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
import { ProjectPurchaseOrderSamplingService } from '../services/project-purchase-order-sampling.service';
import { ProjectVendorMaterialSamplingService } from '../services/project-vendor-material-sampling.service';
import { ProjectVendorProductionSamplingService } from '../services/project-vendor-production-sampling.service';

@ApiBearerAuth()
@ApiTags('Project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectPurchaseOrderSamplingController {
  constructor(
    private readonly projectPurchaseOrderSamplingService: ProjectPurchaseOrderSamplingService,
    private readonly projectVendorMaterialSamplingService: ProjectVendorMaterialSamplingService,
    private readonly projectVendorProductionSamplingService: ProjectVendorProductionSamplingService,
  ) {}

  @Get('sampling/:project_id/detail/:detail_id/purchase-order')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const fabric =
      await this.projectVendorMaterialSamplingService.findVendorMaterialFabricDetailByProjecDetailId(
        detail_id,
      );
    const sewing =
      await this.projectVendorMaterialSamplingService.findVendorMaterialSewingDetailByProjecDetailId(
        detail_id,
      );
    const packaging =
      await this.projectVendorMaterialSamplingService.findVendorMaterialPackagingDetailByProjecDetailId(
        detail_id,
      );
    const finishedGoods =
      await this.projectVendorMaterialSamplingService.findVendorMaterialFinishedGoodDetailByProjecDetailId(
        detail_id,
      );
    const vendor_production =
      await this.projectVendorProductionSamplingService.findVendorProductionDetailPO(
        detail_id,
      );
    const supplier = [...fabric, ...finishedGoods, ...sewing, ...packaging];
    return { supplier, vendor_production };
  }
}
