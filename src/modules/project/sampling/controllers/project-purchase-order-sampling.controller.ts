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
import { ProjectPurchaseOrderSamplingDto } from '../dto/project-purchase-order-sampling.dto';

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
  @Post('sampling/:project_id/detail/:detail_id/purchase-order')
  async createProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectPurchaseOrderSamplingDto: ProjectPurchaseOrderSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPurchaseOrderSamplingService.createPurchaseOrder(
        detail_id,
        projectPurchaseOrderSamplingDto,
        req.user.id,
      );
    return { data };
  }
  @Put(
    'sampling/:project_id/detail/:detail_id/purchase-order/:purchase_order_id',
  )
  async putProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('purchase_order_id') purchase_order_id: number,
    @Body() projectPurchaseOrderSamplingDto: ProjectPurchaseOrderSamplingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPurchaseOrderSamplingService.updatePurchaseOrder(
        purchase_order_id,
        projectPurchaseOrderSamplingDto,
        req.user.id,
      );
    return { data };
  }
}
