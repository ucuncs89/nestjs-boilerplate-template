import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectPlanningAdditionalCostService } from '../services/project-planning-additional-cost.service';
import { ProjectPlanningAdditionalCostDto } from '../dto/project-planning-additional-cost.dto';
import { ProjectCostingAdditionalCostService } from '../../costing/services/project-costing-additional-cost.service';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningAdditionalCostController {
  constructor(
    private readonly projectPlanningAdditionalCostService: ProjectPlanningAdditionalCostService,
    private readonly projectCostingAdditionalCostService: ProjectCostingAdditionalCostService,
    private readonly projectPlanningApprovalService: ProjectPlanningApprovalService,
    private readonly projectDetailCalculateService: ProjectDetailCalculateService,
  ) {}

  @Get(':project_id/additional-cost')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningAdditionalCostService.findAll(
      project_id,
    );
    const compare =
      await this.projectDetailCalculateService.compareTotalPricePlanningIsPassed(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
      );
    const approval = await this.projectPlanningApprovalService.findOneApproval(
      project_id,
      TypeProjectDetailCalculateEnum.AdditionalCost,
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
  @Post(':project_id/additional-cost')
  async postAdditionalCost(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectPlanningAdditionalCostDto: ProjectPlanningAdditionalCostDto,
  ) {
    const data = await this.projectPlanningAdditionalCostService.create(
      project_id,
      projectPlanningAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const avgPrice =
        await this.projectPlanningAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Planning,
        avgPrice,
      );
    }
    return {
      data,
    };
  }

  @Get(':project_id/additional-cost/:additional_id')
  async findOneDetail(
    @Param('project_id') project_id: number,
    @Param('additional_id') additional_id: number,
  ) {
    const data = await this.projectPlanningAdditionalCostService.findOne(
      project_id,
      additional_id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/additional-cost/:additional_id')
  async updateOne(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('additional_id') additional_id: number,
    @Body() projectPlanningAdditionalCostDto: ProjectPlanningAdditionalCostDto,
  ) {
    const data = await this.projectPlanningAdditionalCostService.update(
      project_id,
      additional_id,
      projectPlanningAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const avgPrice =
        await this.projectPlanningAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Planning,
        avgPrice,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/additional-cost/:additional_id')
  async deleteAdditionalPrice(
    @Param('project_id') project_id: number,
    @Param('additional_id') additional_id: number,
  ) {
    const data = await this.projectPlanningAdditionalCostService.remove(
      project_id,
      additional_id,
    );
    if (data) {
      const avgPrice =
        await this.projectPlanningAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Planning,
        avgPrice,
      );
    }
    return {
      data,
    };
  }

  @Get(':project_id/additional-cost/compare')
  async compare(@Param('project_id') project_id: number) {
    const costing = await this.projectCostingAdditionalCostService.findAll(
      project_id,
    );
    const planning = await this.projectPlanningAdditionalCostService.findAll(
      project_id,
    );
    return {
      costing,
      planning,
    };
  }
  @Post(':project_id/additional-cost/approval-request')
  async approvalRequest(@Req() req, @Param('project_id') project_id: number) {
    const data =
      await this.projectPlanningApprovalService.createPlanningApproval(
        {
          relation_id: project_id,
          status: StatusApprovalEnum.waiting,
          type: TypeProjectDetailCalculateEnum.AdditionalCost,
          name: 'Additional Cost',
          project_id,
        },
        req.user.id,
      );
    return { data };
  }
}
