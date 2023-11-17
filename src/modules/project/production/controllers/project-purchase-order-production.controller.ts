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

import { ProjectPurchaseOrderProductionService } from '../services/project-purchase-order-production.service';
import { ProjectVendorMaterialProductionService } from '../services/project-vendor-material-production.service';
import { ProjectVendorProductionProductionService } from '../services/project-vendor-production-production.service';
import { ProjectPurchaseOrderProductionDto } from '../dto/project-purchase-order-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectPurchaseOrderProductionController {
  constructor(
    private readonly projectPurchaseOrderProductionService: ProjectPurchaseOrderProductionService,
    private readonly projectVendorMaterialProductionService: ProjectVendorMaterialProductionService,
    private readonly projectVendorProductionProductionService: ProjectVendorProductionProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/purchase-order')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const fabric =
      await this.projectVendorMaterialProductionService.findVendorMaterialFabricDetailByProjecDetailId(
        detail_id,
      );
    const sewing =
      await this.projectVendorMaterialProductionService.findVendorMaterialSewingDetailByProjecDetailId(
        detail_id,
      );
    const packaging =
      await this.projectVendorMaterialProductionService.findVendorMaterialPackagingDetailByProjecDetailId(
        detail_id,
      );
    const finishedGoods =
      await this.projectVendorMaterialProductionService.findVendorMaterialFinishedGoodDetailByProjecDetailId(
        detail_id,
      );
    const vendor_production =
      await this.projectVendorProductionProductionService.findVendorProductionDetailPO(
        detail_id,
      );
    const supplier = [...fabric, ...finishedGoods, ...sewing, ...packaging];
    return { supplier, vendor_production };
    // return { vendor_production };
  }
  @Post('production/:project_id/detail/:detail_id/purchase-order')
  async createProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectPurchaseOrderProductionDto: ProjectPurchaseOrderProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPurchaseOrderProductionService.createPurchaseOrder(
        detail_id,
        projectPurchaseOrderProductionDto,
        req.user.id,
      );
    return { data };
  }
  @Put(
    'production/:project_id/detail/:detail_id/purchase-order/:purchase_order_id',
  )
  async putProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('purchase_order_id') purchase_order_id: number,
    @Body()
    projectPurchaseOrderProductionDto: ProjectPurchaseOrderProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPurchaseOrderProductionService.updatePurchaseOrder(
        purchase_order_id,
        projectPurchaseOrderProductionDto,
        req.user.id,
      );
    return { data };
  }
  @Get(
    'production/:project_id/detail/:detail_id/purchase-order/:purchase_order_id',
  )
  async getDetailProjectPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('purchase_order_id') purchase_order_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPurchaseOrderProductionService.findDetailPurcahseOrder(
        purchase_order_id,
      );
    return { data };
  }
}
