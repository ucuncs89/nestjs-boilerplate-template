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
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPlanningVendorProductionService } from '../services/project-planning-vendor-production.service';
import { ProjectPlanningVendorProductionDetailDto } from '../dto/project-planning-vendor-production.dto';
import { ProjectCostingVendorProductionService } from '../../costing/services/project-costing-vendor-production.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';
import { AppErrorException } from 'src/exceptions/app-exception';
import { PurchaseOrderService } from 'src/modules/purchase-order/services/purchase-order.service';
import {
  PurchaseOrderTypeEnum,
  StatusPurchaseOrderEnum,
} from 'src/modules/purchase-order/dto/purchase-order.dto';
import { VendorsService } from 'src/modules/vendors/services/vendors.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningVendorProductionController {
  constructor(
    private projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,
    private projectCostingVendorProductionService: ProjectCostingVendorProductionService,
    private projectPlanningApprovalService: ProjectPlanningApprovalService,
    private projectDetailCalculateService: ProjectDetailCalculateService,
    private purchaseOrderService: PurchaseOrderService,
    private vendorsService: VendorsService,
  ) {}

  @Get(':project_id/vendor-production')
  async getVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.findVendorProduction(
        project_id,
      );
    const approval = await this.projectPlanningApprovalService.findOneApproval(
      project_id,
      TypeProjectDetailCalculateEnum.Production,
    );
    const compare =
      await this.projectDetailCalculateService.compareCostingPlanningIsPassed(
        project_id,
        TypeProjectDetailCalculateEnum.Production,
      );
    if (approval !== null && approval.status === StatusApprovalEnum.approved) {
      compare.is_passed = true;
    }
    return {
      data,
      approval,
      compare,
    };
  }

  @Post(':project_id/vendor-production')
  async createVendorProductionDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.createVendorProduction(
        project_id,
        projectPlanningVendorProductionDetailDto,
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
      await this.projectPlanningVendorProductionService.deleteVendorProductionDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
        req.user.id,
        project_id,
      );
    return { data };
  }

  @Get(':project_id/vendor-production/compare')
  async getCompareVendorProduction(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const costing =
      await this.projectCostingVendorProductionService.findVendorProduction(
        project_id,
      );
    const planning =
      await this.projectPlanningVendorProductionService.findVendorProduction(
        project_id,
      );
    return { costing, planning };
  }
  @Post(':project_id/vendor-production/approval-request')
  async approvalRequest(@Req() req, @Param('project_id') project_id: number) {
    const data =
      await this.projectPlanningApprovalService.createPlanningApproval(
        {
          relation_id: project_id,
          status: StatusApprovalEnum.waiting,
          type: TypeProjectDetailCalculateEnum.Production,
          name: `${TypeProjectDetailCalculateEnum.Production}`,
          project_id,
        },
        req.user.id,
      );
    return { data };
  }
  @Post(
    ':project_id/vendor-production/:project_vendor_id/detail/:project_vendor_production_detail_id/request-purchase-order',
  )
  async requestPurchaseOrder(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('project_vendor_production_detail_id')
    project_vendor_production_detail_id: number,
  ) {
    let purchase_order_detail_id: number;
    const detail =
      await this.projectPlanningVendorProductionService.findNameDetail(
        project_vendor_id,
        project_vendor_production_detail_id,
      );
    if (!detail) {
      throw new AppErrorException(
        'project vendor detail not sync or not found',
      );
    }
    const purchaseOrder = await this.purchaseOrderService.findByProjectIdType(
      project_id,
      PurchaseOrderTypeEnum.Production,
      detail.vendor_id,
    );
    if (!purchaseOrder) {
      const detailVendor = await this.vendorsService.findOne(detail.vendor_id);
      const insertPurchaseOrder = await this.purchaseOrderService.create(
        {
          vendor_id: detail.vendor_id,
          company_name: detailVendor.company_name,
          project_id,
          type: PurchaseOrderTypeEnum.Production,
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
            item: `${detail.vendor_name} - ${detail.vendor_production.activity_name}`,
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
            item: `${detail.vendor_name} - ${detail.vendor_production.activity_name}`,
            quantity: detail.quantity,
            unit_price: detail.price,
            unit: detail.quantity_unit,
            sub_total: detail.total_price,
          },
        );
    }
    this.projectPlanningVendorProductionService.updateStatusPurchaseOrder(
      project_vendor_production_detail_id,
      StatusPurchaseOrderEnum.Waiting,
      purchase_order_detail_id,
    );
    return { data: detail, purchaseOrder };
  }
}
