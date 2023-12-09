import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../../general/services/project-detail.service';
import { ProjectService } from '../../general/services/project.service';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import { ProjectMaterialItemEnum } from '../dto/project-planning-material.dto';
import { ProjectPlanningVariantService } from '../services/project-planning-variant.service';
import { ProjectPlanningVendorProductionService } from '../services/project-planning-vendor-production.service';
import { ProjectPlanningShippingService } from '../services/project-planning-shipping.service';
import { ProjectPlanningPriceService } from '../services/project-planning-price.service';
import { ProjectPlanningVendorMaterialService } from '../services/project-planning-vendor-material.service';
import { ProjectPlanningSetSamplingService } from '../services/project-planning-set-sampling.service';
import { ProjectPlanningConfirmDto } from '../dto/project-planning-confirm.dto';
import { ProjectPlanningConfirmService } from '../services/project-planning-confirm.service';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningConfirmReviewController {
  constructor(
    private readonly projectDetailService: ProjectDetailService,
    private readonly projectService: ProjectService,
    private readonly projectPlanningMaterialService: ProjectPlanningMaterialService,
    private readonly projectPlanningVariantService: ProjectPlanningVariantService,
    private readonly projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,
    private readonly projectPlanningShippingService: ProjectPlanningShippingService,
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
    private readonly projectPlanningVendorMaterialService: ProjectPlanningVendorMaterialService,
    private readonly projectPlanningSetSamplingService: ProjectPlanningSetSamplingService,
    private readonly projectPlanningConfirmService: ProjectPlanningConfirmService,
  ) {}

  @Post(':project_id/detail/:detail_id/confirmation')
  async createConfirm(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectPlanningConfirmDto: ProjectPlanningConfirmDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDetailService.updateIsConfirm(
      project_id,
      detail_id,
      projectPlanningConfirmDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/review/size-quantity')
  async getSizeQuality(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectService.findSize(project_id);
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/material')
  async getMaterial(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const detail = await this.projectDetailService.findById(detail_id);
    const fabric = await this.projectPlanningMaterialService.listMaterialItem(
      detail_id,
      { type: ProjectMaterialItemEnum.Fabric },
      req.user.id,
    );
    const accessories_sewing =
      await this.projectPlanningMaterialService.listMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Sewing },
        req.user.id,
      );
    const accessories_packaging =
      await this.projectPlanningMaterialService.listMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Packaging },
        req.user.id,
      );
    const finished_goods =
      await this.projectPlanningMaterialService.listMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Finishedgoods },
        req.user.id,
      );
    return {
      data: {
        ...detail,
        fabric,
        accessories_sewing,
        accessories_packaging,
        finished_goods,
      },
    };
  }
  @Get(':project_id/detail/:detail_id/review/variant')
  async getVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const variant = await this.projectPlanningVariantService.findVariant(
      detail_id,
    );
    const fabric = await this.projectPlanningMaterialService.listMaterialItem(
      detail_id,
      { type: ProjectMaterialItemEnum.Fabric },
      req.user.id,
    );
    const arrResult = [];
    for (const data of variant) {
      arrResult.push({ ...data, fabric });
    }
    return { data: arrResult };
  }
  @Get(':project_id/detail/:detail_id/review/consumption')
  async getConsumption(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const material = await this.projectPlanningMaterialService.listMaterialItem(
      detail_id,
      { type: null },
      req.user.id,
    );
    const variant = await this.projectPlanningVariantService.findVariant(
      detail_id,
    );
    const arrResult = [];
    for (const data of material) {
      arrResult.push({ ...data, variant });
    }
    return { data: arrResult };
  }

  @Get(':project_id/detail/:detail_id/review/vendor')
  async getVendor(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorProductionService.findVendorProductionDetailReview(
        detail_id,
      );

    const total_price = data.reduce((sum, item) => sum + item.price, 0);
    const percentage_of_loss =
      await this.projectPlanningVendorProductionService.findIdsVendorProduction(
        detail_id,
      );
    return { data, total_price, percentage_of_loss };
  }

  @Get(':project_id/detail/:detail_id/review/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningShippingService.findByProjectDetailId(
        detail_id,
      );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/review/set-sampling')
  async getSetSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningSetSamplingService.findProjectSetSamplingOne(
        detail_id,
      );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/review/pricing')
  async getPricing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningPriceService.findProjectPrice(
      detail_id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/supplier')
  async getSupplier(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        { type: null },
        req.user.id,
      );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/review/total-cost')
  async getTotalCost(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const materialFabric =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Fabric },
        req.user.id,
      );
    const materialSewing =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Sewing },
        req.user.id,
      );
    const materialPackaging =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Packaging },
        req.user.id,
      );
    const materialFinishedGoods =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        { type: ProjectMaterialItemEnum.Finishedgoods },
        req.user.id,
      );
    const sumQuantity = await this.projectService.sumProjectSizeQuantity(
      project_id,
    );
    const listProduction =
      await this.projectPlanningVendorProductionService.findVendorProduction(
        detail_id,
      );
    const projectPrice =
      await this.projectPlanningPriceService.findProjectPrice(detail_id);
    const projectDetail = await this.projectDetailService.findById(detail_id);
    const listDelivery =
      await this.projectPlanningShippingService.findByProjectDetailId(
        detail_id,
      );
    const data =
      await this.projectPlanningConfirmService.findAndCalculateTotalCost(
        materialFabric,
        materialSewing,
        materialPackaging,
        materialFinishedGoods,
        sumQuantity,
        listProduction,
        projectPrice,
        projectDetail,
        listDelivery,
      );
    return { data };
  }
}
