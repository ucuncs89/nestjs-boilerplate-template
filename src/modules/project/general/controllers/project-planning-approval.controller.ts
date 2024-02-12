import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectPlanningApprovalService } from '../services/project-planning-approval.service';
import { TypeProjectDetailCalculateEnum } from '../dto/project-detail.dto';
import { ProjectPlanningAdditionalCostService } from '../../planning/services/project-planning-additional-cost.service';
import { ProjectPlanningSamplingService } from '../../planning/services/project-planning-sampling.service';
import { ProjectPlanningShippingService } from '../../planning/services/project-planning-shipping.service';
import { ProjectPlanningVendorProductionService } from '../../planning/services/project-planning-vendor-production.service';
import { ProjectPlanningMaterialService } from '../../planning/services/project-planning-material.service';
import { ProjectApprovalPlanningStatusDto } from '../dto/project-planning-approval.dto';

@ApiBearerAuth()
@ApiTags('project planning-approval')
@UseGuards(JwtAuthGuard)
@Controller('project/planning-approval')
export class ProjectPlanningApprovalController {
  constructor(
    private projectPlanningApprovalService: ProjectPlanningApprovalService,
    private projectPlanningAdditionalCostService: ProjectPlanningAdditionalCostService,
    private projectPlanningSamplingService: ProjectPlanningSamplingService,
    private projectPlanningShippingService: ProjectPlanningShippingService,
    private projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,
    private projectPlanningMaterialService: ProjectPlanningMaterialService,
  ) {}
  @Get(':project_id')
  async findAll(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningApprovalService.findAll(project_id);
    return { data };
  }
  @Get(':project_id/detail/:id')
  async findOne(
    @Param('project_id') project_id: number,
    @Param('id') id: number,
  ) {
    const data = await this.projectPlanningApprovalService.findOne(
      id,
      project_id,
    );
    let compare: any;
    switch (data.type) {
      case TypeProjectDetailCalculateEnum.AdditionalCost:
        compare = await this.projectPlanningAdditionalCostService.compareFind(
          data.relation_id,
        );
        break;
      case TypeProjectDetailCalculateEnum.Sampling:
        compare = await this.projectPlanningSamplingService.findCompare(
          data.relation_id,
        );
        break;
      case TypeProjectDetailCalculateEnum.Shipping:
        compare =
          await this.projectPlanningShippingService.findCompareByProjectDetailId(
            data.relation_id,
          );
        break;
      case TypeProjectDetailCalculateEnum.Production:
        compare =
          await this.projectPlanningVendorProductionService.findCompareProduction(
            data.relation_id,
          );
        break;
      case TypeProjectDetailCalculateEnum.Material:
        compare = await this.projectPlanningMaterialService.findCompareOne(
          data.relation_id,
        );
        break;

      default:
        break;
    }
    return { data, compare };
  }
  @Put(':project_id/detail/:id/approval')
  async approvalPlanning(
    @Param('project_id') project_id: number,
    @Param('id') id: number,
    @Body() projectApprovalPlanningStatusDto: ProjectApprovalPlanningStatusDto,
  ) {
    const data = await this.projectPlanningApprovalService.updateApproval(
      id,
      projectApprovalPlanningStatusDto,
    );
    return { data };
  }
}
