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
  ) {}

  //   @Post(':project_id/detail/:detail_id/confirmation')
  //   async createConfirm(
  //     @Req() req,
  //     @Param('project_id') project_id: number,
  //     @Param('detail_id') detail_id: number,
  //     @Body() projectConfirmDto: ProjectConfirmDto,
  //     @I18n() i18n: I18nContext,
  //   ) {
  //     const data = await this.projectDetailService.updateIsConfirm(
  //       project_id,
  //       detail_id,
  //       projectConfirmDto,
  //       req.user.id,
  //       i18n,
  //     );
  //     return { data };
  //   }

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
    return {
      data: { ...detail, fabric, accessories_sewing, accessories_packaging },
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

  //   @Get(':project_id/detail/:detail_id/review/set-sampling')
  //   async getSetSampling(
  //     @Req() req,
  //     @Param('project_id') project_id: number,
  //     @Param('detail_id') detail_id: number,
  //     @I18n() i18n: I18nContext,
  //   ) {
  //     const data = await this.projectSetSamplingService.findProjectSetSamplingOne(
  //       detail_id,
  //     );
  //     return { data };
  //   }

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
}
