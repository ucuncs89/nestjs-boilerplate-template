import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPlanningVendorMaterialService } from '../services/project-planning-vendor-material.service';
import { ProjectPlanningVendorMaterialDto } from '../dto/project-planning-vendor-material.dto';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import { AppErrorException } from 'src/exceptions/app-exception';
import { PurchaseOrderService } from 'src/modules/purchase-order/services/purchase-order.service';
import { VendorsService } from 'src/modules/vendors/services/vendors.service';
import {
  PurchaseOrderTypeEnum,
  StatusPurchaseOrderEnum,
} from 'src/modules/purchase-order/dto/purchase-order.dto';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningVendorMaterialController {
  constructor(
    private projectPlanningVendorMaterialService: ProjectPlanningVendorMaterialService,
    private projectPlanningMaterialService: ProjectPlanningMaterialService,
    private purchaseOrderService: PurchaseOrderService,
    private vendorsService: VendorsService,
  ) {}

  @Post(':project_id/vendor-material/:vendor_material_id')
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const material =
      await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
        vendor_material_id,
      );
    if (!material) {
      throw new AppErrorException(
        'vendor_material_id and material_id cannot relate',
      );
    }
    const data =
      await this.projectPlanningVendorMaterialService.createVendorMaterialDetail(
        project_id,
        vendor_material_id,
        projectPlanningVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
        material,
      );
    }
    return { data };
  }
  @Put(
    ':project_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async updateOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Body()
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorMaterialService.updateVendorMaterialDetail(
        project_id,
        vendor_material_detail_id,
        projectPlanningVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
        material,
      );
    }
    return { data };
  }
  @Delete(
    ':project_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async deleteOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorMaterialService.deleteVendorMaterialDetail(
        vendor_material_id,
        vendor_material_detail_id,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
        material,
      );
    }
    return { data };
  }

  @Post(
    ':project_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id/request-purchase-order',
  )
  async requestPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    let purchase_order_detail_id: number;
    const detail =
      await this.projectPlanningVendorMaterialService.findNameDetail(
        vendor_material_id,
        vendor_material_detail_id,
      );
    if (!detail) {
      throw new AppErrorException(
        'project vendor detail not sync or not found',
      );
    }
    const purchaseOrder = await this.purchaseOrderService.findByProjectIdType(
      project_id,
      PurchaseOrderTypeEnum.Material,
      detail.vendor_id,
    );
    if (!purchaseOrder) {
      const detailVendor = await this.vendorsService.findOne(detail.vendor_id);
      const insertPurchaseOrder = await this.purchaseOrderService.create(
        {
          vendor_id: detail.vendor_id,
          company_name: detailVendor.company_name,
          project_id,
          type: PurchaseOrderTypeEnum.Material,
          bank_name: detailVendor.bank_name,
          company_address: detailVendor.company_address,
          bank_account_number: detailVendor.bank_account_number,
          bank_account_houlders_name: detailVendor.bank_account_holder_name,
          company_phone_number: detailVendor.company_phone_number,
        },
        req.user.id,
      );
      purchase_order_detail_id =
        await this.purchaseOrderService.upsertPurchaseOrderDetail(
          insertPurchaseOrder.id,
          {
            relation_id: detail.id,
            item: `${detail.vendor_material.project_material_item.name} ${
              detail.vendor_material.project_material_item.category
            }${
              detail.vendor_material.project_material_item.used_for
                ? ' - ' + detail.vendor_material.project_material_item.used_for
                : ''
            } - ${detail.vendor_material.project_variant.name}`,
            quantity: detail.quantity,
            unit_price: detail.price,
            unit: detail.quantity_unit,
            sub_total: detail.total_price,
          },
        );
    } else {
      purchase_order_detail_id =
        await this.purchaseOrderService.upsertPurchaseOrderDetail(
          purchaseOrder.id,
          {
            relation_id: detail.id,
            item: `${detail.vendor_material.project_material_item.name} ${
              detail.vendor_material.project_material_item.category
            }${
              detail.vendor_material.project_material_item.used_for
                ? ' - ' + detail.vendor_material.project_material_item.used_for
                : ''
            } - ${detail.vendor_material.project_variant.name}`,
            quantity: detail.quantity,
            unit_price: detail.price,
            unit: detail.quantity_unit,
            sub_total: detail.total_price,
          },
        );
    }
    this.projectPlanningVendorMaterialService.updateStatusPurchaseOrder(
      vendor_material_detail_id,
      StatusPurchaseOrderEnum.Waiting,
      purchase_order_detail_id,
    );
    return { data: detail, purchaseOrder };
  }
}
