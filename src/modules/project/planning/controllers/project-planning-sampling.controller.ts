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
import { ProjectPlanningSamplingDto } from '../dto/project-planning-sampling.dto';
import { ProjectPlanningSamplingService } from '../services/project-planning-sampling.service';
import { ProjectCostingSamplingService } from '../../costing/services/project-costing-sampling.service';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectVariantService } from '../../general/services/project-variant.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningSamplingController {
  constructor(
    private readonly projectPlanningSamplingService: ProjectPlanningSamplingService,
    private readonly projectCostingSamplingService: ProjectCostingSamplingService,
    private readonly projectPlanningApprovalService: ProjectPlanningApprovalService,
    private readonly projectDetailCalculateService: ProjectDetailCalculateService,
    private readonly projectVariantService: ProjectVariantService,
  ) {}

  @Get(':project_id/sampling')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningSamplingService.findAll(project_id);
    const approval = await this.projectPlanningApprovalService.findOneApproval(
      project_id,
      TypeProjectDetailCalculateEnum.Sampling,
    );
    const compare =
      await this.projectDetailCalculateService.compareTotalPricePlanningIsPassed(
        project_id,
        TypeProjectDetailCalculateEnum.Sampling,
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
  @Post(':project_id/sampling')
  async postSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectPlanningSamplingDto: ProjectPlanningSamplingDto,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item =
      projectPlanningSamplingDto.total_cost / variantTotalItem;
    const data = await this.projectPlanningSamplingService.create(
      project_id,
      projectPlanningSamplingDto,
      req.user.id,
      cost_per_item,
    );
    if (data) {
      const calculateSampling =
        await this.projectPlanningSamplingService.sumGrandAvgPriceTotalSampling(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Sampling,
        StatusProjectEnum.Planning,
        calculateSampling.avg_price,
        calculateSampling.total_cost,
      );
    }
    return {
      data,
    };
  }

  @Get(':project_id/sampling/:sampling_id')
  async findOneDetail(
    @Param('project_id') project_id: number,
    @Param('sampling_id') sampling_id: number,
  ) {
    const data = await this.projectPlanningSamplingService.findOne(
      project_id,
      sampling_id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/sampling/:sampling_id')
  async updateOne(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('sampling_id') sampling_id: number,
    @Body() projectPlanningSamplingDto: ProjectPlanningSamplingDto,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item =
      projectPlanningSamplingDto.total_cost / variantTotalItem;
    const data = await this.projectPlanningSamplingService.update(
      project_id,
      sampling_id,
      projectPlanningSamplingDto,
      req.user.id,
      cost_per_item,
    );
    if (data) {
      const calculateSampling =
        await this.projectPlanningSamplingService.sumGrandAvgPriceTotalSampling(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Sampling,
        StatusProjectEnum.Planning,
        calculateSampling.avg_price,
        calculateSampling.total_cost,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/sampling/:sampling_id')
  async deleteSampling(
    @Param('project_id') project_id: number,
    @Param('sampling_id') sampling_id: number,
  ) {
    const data = await this.projectPlanningSamplingService.remove(
      project_id,
      sampling_id,
    );
    if (data) {
      const calculateSampling =
        await this.projectPlanningSamplingService.sumGrandAvgPriceTotalSampling(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.Sampling,
        StatusProjectEnum.Planning,
        calculateSampling.avg_price,
        calculateSampling.total_cost,
      );
    }
    return {
      data,
    };
  }
  @Get(':project_id/sampling/compare')
  async findListCompare(@Param('project_id') project_id: number) {
    const costing = await this.projectCostingSamplingService.findAll(
      project_id,
    );
    const planning = await this.projectPlanningSamplingService.findAll(
      project_id,
    );
    return {
      planning,
      costing,
    };
  }
  @Post(':project_id/sampling/approval-request')
  async approvalRequest(@Req() req, @Param('project_id') project_id: number) {
    const data =
      await this.projectPlanningApprovalService.createPlanningApproval(
        {
          relation_id: project_id,
          status: StatusApprovalEnum.waiting,
          type: TypeProjectDetailCalculateEnum.Sampling,
          name: `${TypeProjectDetailCalculateEnum.Sampling}`,
          project_id,
        },
        req.user.id,
      );
    return { data };
  }
}
