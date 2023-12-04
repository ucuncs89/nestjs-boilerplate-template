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
import { ProjectProductionPurchaseOrderService } from '../services/project-production-purchase-order.service';
import { ProjectProductionVendorMaterialService } from '../services/project-production-vendor-material.service';
import { ProjectProductionVendorProductionService } from '../services/project-production-vendor-production.service';
import { ProjectProductionPurchaseOrderDto } from '../dto/project-production-purchase-order.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionPurchaseOrderController {
  constructor(
    private readonly projectProductionPurchaseOrderService: ProjectProductionPurchaseOrderService,
    private readonly projectProductionVendorMaterialService: ProjectProductionVendorMaterialService,
    private readonly projectProductionVendorProductionService: ProjectProductionVendorProductionService,
  ) {}

  @Get(':project_id/detail/:detail_id/purchase-order')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const supplier =
      await this.projectProductionVendorMaterialService.findVendorMaterialItemDetailByProjecDetailId(
        detail_id,
      );

    const vendor_production =
      await this.projectProductionVendorProductionService.findVendorProductionDetailPO(
        detail_id,
      );
    return { supplier, vendor_production };
    // return { vendor_production };
  }
  @Post(':project_id/detail/:detail_id/purchase-order')
  async createProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectProductionPurchaseOrderDto: ProjectProductionPurchaseOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionPurchaseOrderService.createPurchaseOrder(
        detail_id,
        projectProductionPurchaseOrderDto,
        req.user.id,
      );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/purchase-order/:purchase_order_id')
  async putProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('purchase_order_id') purchase_order_id: number,
    @Body()
    projectProductionPurchaseOrderDto: ProjectProductionPurchaseOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionPurchaseOrderService.updatePurchaseOrder(
        purchase_order_id,
        projectProductionPurchaseOrderDto,
        req.user.id,
      );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/purchase-order/:purchase_order_id')
  async getDetailProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('purchase_order_id') purchase_order_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionPurchaseOrderService.findDetailPurcahseOrder(
        purchase_order_id,
      );
    return { data };
  }
}
