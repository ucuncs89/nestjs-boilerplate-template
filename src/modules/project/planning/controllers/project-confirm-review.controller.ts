import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../../general/services/project-detail.service';
import { ProjectConfirmDto } from '../dto/project-confirm.dto';
import { ProjectService } from '../../general/services/project.service';
import { ProjectMaterialService } from '../services/project-material.service';
import { ProjectVariantService } from '../services/project-variant.service';
import { ProjectVendorProductionService } from '../services/project-vendor-production.service';
import { ProjectShippingService } from '../services/project-shipping.service';
import { ProjectSetSamplingService } from '../services/project-set-sampling.service';
import { ProjectPriceService } from '../services/project-price.service';
import { ProjectHistoryService } from '../../general/services/project-history.service';

@ApiBearerAuth()
@ApiTags('Project Planning')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectConfirmReviewController {
  constructor(
    private readonly projectDetailService: ProjectDetailService,
    private readonly projectService: ProjectService,
    private readonly projectMaterialService: ProjectMaterialService,
    private readonly projectVariantService: ProjectVariantService,
    private readonly projectVendorProductionService: ProjectVendorProductionService,
    private readonly projectShippingService: ProjectShippingService,
    private readonly projectSetSamplingService: ProjectSetSamplingService,
    private readonly projectPriceService: ProjectPriceService,
    private readonly projectHistoryService: ProjectHistoryService,
  ) {}

  @Post(':project_id/detail/:detail_id/confirmation')
  async createConfirm(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectConfirmDto: ProjectConfirmDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDetailService.updateIsConfirm(
      project_id,
      detail_id,
      projectConfirmDto,
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
    const data = await this.projectMaterialService.findByProjectDetail(
      project_id,
      detail_id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/variant')
  async getVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const variant = await this.projectVariantService.findByProjectDetail(
      project_id,
      detail_id,
    );
    const fabric = await this.projectMaterialService.findMaterialName(
      detail_id,
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
    const fabric = await this.projectMaterialService.findProjectFabricVariant(
      detail_id,
    );
    const sewing = await this.projectMaterialService.findProjectSewingVariant(
      detail_id,
    );
    const packaging =
      await this.projectMaterialService.findProjectPackagingVariant(detail_id);
    const data = [...fabric, ...sewing, ...packaging].map((item) => {
      return { ...item, type: this.getType(item) };
    });
    return { data };
  }

  @Get(':project_id/detail/:detail_id/review/vendor')
  async getVendor(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionService.findVendorProductionDetailReview(
        detail_id,
      );

    const total_price = data.reduce((sum, item) => sum + item.price, 0);
    const percentage_of_loss =
      await this.projectVendorProductionService.findIdsVendorProduction(
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
    const data = await this.projectShippingService.findProjectShipping(
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
    const data = await this.projectSetSamplingService.findProjectSetSamplingOne(
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
    const data = await this.projectPriceService.findProjectPrice(detail_id);
    return { data };
  }
  @Get(':project_id/detail/:detail_id/review/supplier')
  async getSupplier(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const fabric = await this.projectMaterialService.findProjectConfirmFabric(
      detail_id,
    );
    const sewing = await this.projectMaterialService.findProjectConfirmSewing(
      detail_id,
    );
    const packaging =
      await this.projectMaterialService.findProjectConfirmPackaging(detail_id);
    const finishedGoods =
      await this.projectMaterialService.findProjectConfirmFinishedGood(
        detail_id,
      );

    const data = [...finishedGoods, ...fabric, ...sewing, ...packaging];
    return { data };
  }

  getType(item) {
    if ('fabric_id' in item) {
      return 'fabric';
    } else if ('accessories_sewing_id' in item) {
      return 'sewing';
    } else {
      return 'packaging';
    }
  }
}
