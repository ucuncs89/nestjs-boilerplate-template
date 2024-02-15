import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPlanningShippingService } from '../services/project-planning-shipping.service';
import { ProjectPlanningShippingDto } from '../dto/project-planning-shipping.dto';
import { ProjectCostingShippingService } from '../../costing/services/project-costing-shipping.service';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningShippingController {
  constructor(
    private readonly projectPlanningShippingService: ProjectPlanningShippingService,
    private readonly projectCostingShippingService: ProjectCostingShippingService,
    private readonly projectPlanningApprovalService: ProjectPlanningApprovalService,
    private readonly projectDetailCalculateService: ProjectDetailCalculateService,
  ) {}

  @Get(':project_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningShippingService.findByProjectDetailId(
        project_id,
      );
    const approval = await this.projectPlanningApprovalService.findOneApproval(
      project_id,
      TypeProjectDetailCalculateEnum.Shipping,
    );
    const compare =
      await this.projectDetailCalculateService.compareCostingPlanningIsPassed(
        project_id,
        TypeProjectDetailCalculateEnum.Shipping,
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
  @Post(':project_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectPlanningShippingDto: ProjectPlanningShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningShippingService.createShipping(
      project_id,
      projectPlanningShippingDto,
      req.user.id,
    );
    if (data) {
      const calculateShipping =
        await this.projectPlanningShippingService.sumGrandAvgPriceTotalShipping(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Shipping,
        StatusProjectEnum.Planning,
        calculateShipping.avg_price,
        calculateShipping.total_cost,
      );
    }
    return { data };
  }
  @Put(':project_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectPlanningShippingDto: ProjectPlanningShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningShippingService.updateShipping(
      shipping_id,
      projectPlanningShippingDto,
      req.user.id,
    );
    if (data) {
      const calculateShipping =
        await this.projectPlanningShippingService.sumGrandAvgPriceTotalShipping(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Shipping,
        StatusProjectEnum.Planning,
        calculateShipping.avg_price,
        calculateShipping.total_cost,
      );
    }
    return { data };
  }
  @Get(':project_id/shipping/:shipping_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }
  @Delete(':project_id/shipping/:shipping_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningShippingService.deleteShipping(
      shipping_id,
    );
    if (data) {
      const calculateShipping =
        await this.projectPlanningShippingService.sumGrandAvgPriceTotalShipping(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Shipping,
        StatusProjectEnum.Planning,
        calculateShipping.avg_price,
        calculateShipping.total_cost,
      );
    }
    return { data };
  }
  @Get(':project_id/shipping/compare')
  async getShippingCompare(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const costing =
      await this.projectCostingShippingService.findByProjectDetailId(
        project_id,
      );
    const planning =
      await this.projectPlanningShippingService.findByProjectDetailId(
        project_id,
      );
    return { costing, planning };
  }
  @Post(':project_id/shipping/approval-request')
  async approvalRequest(@Req() req, @Param('project_id') project_id: number) {
    const data =
      await this.projectPlanningApprovalService.createPlanningApproval(
        {
          relation_id: project_id,
          status: StatusApprovalEnum.waiting,
          type: TypeProjectDetailCalculateEnum.Shipping,
          name: `${TypeProjectDetailCalculateEnum.Shipping}`,
          project_id,
        },
        req.user.id,
      );
    return { data };
  }
}
