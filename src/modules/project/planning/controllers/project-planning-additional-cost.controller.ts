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

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningAdditionalCostController {
  constructor(
    private readonly projectPlanningAdditionalCostService: ProjectPlanningAdditionalCostService,
    private readonly projectCostingAdditionalCostService: ProjectCostingAdditionalCostService,
  ) {}

  @Get(':project_id/additional-cost')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningAdditionalCostService.findAll(
      project_id,
    );
    return {
      data,
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
}
