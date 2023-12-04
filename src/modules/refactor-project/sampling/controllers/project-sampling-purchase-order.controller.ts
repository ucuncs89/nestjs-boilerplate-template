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
import { ProjectSamplingPurchaseOrderService } from '../services/project-sampling-purchase-order.service';
import { ProjectSamplingVendorMaterialService } from '../services/project-sampling-vendor-material.service';
import { ProjectSamplingVendorProductionService } from '../services/project-sampling-vendor-production.service';
import { ProjectSamplingPurchaseOrderDto } from '../dto/project-sampling-purchase-order.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/sampling')
export class ProjectSamplingPurchaseOrderController {
  constructor(
    private readonly projectSamplingPurchaseOrderService: ProjectSamplingPurchaseOrderService,
    private readonly projectSamplingVendorMaterialService: ProjectSamplingVendorMaterialService,
    private readonly projectSamplingVendorProductionService: ProjectSamplingVendorProductionService,
  ) {}

  @Get(':project_id/detail/:detail_id/purchase-order')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const supplier =
      await this.projectSamplingVendorMaterialService.findVendorMaterialItemDetailByProjecDetailId(
        detail_id,
      );

    const vendor_production =
      await this.projectSamplingVendorProductionService.findVendorProductionDetailPO(
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
    @Body() projectSamplingPurchaseOrderDto: ProjectSamplingPurchaseOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectSamplingPurchaseOrderService.createPurchaseOrder(
        detail_id,
        projectSamplingPurchaseOrderDto,
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
    @Body() projectSamplingPurchaseOrderDto: ProjectSamplingPurchaseOrderDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectSamplingPurchaseOrderService.updatePurchaseOrder(
        purchase_order_id,
        projectSamplingPurchaseOrderDto,
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
      await this.projectSamplingPurchaseOrderService.findDetailPurcahseOrder(
        purchase_order_id,
      );
    return { data };
  }
}
