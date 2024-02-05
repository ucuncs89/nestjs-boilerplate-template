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

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningSamplingController {
  constructor(
    private readonly projectPlanningSamplingService: ProjectPlanningSamplingService,
    private readonly projectCostingSamplingService: ProjectCostingSamplingService,
  ) {}

  @Get(':project_id/sampling')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningSamplingService.findAll(project_id);
    return {
      data,
    };
  }
  @Post(':project_id/sampling')
  async postSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectPlanningSamplingDto: ProjectPlanningSamplingDto,
  ) {
    const data = await this.projectPlanningSamplingService.create(
      project_id,
      projectPlanningSamplingDto,
      req.user.id,
    );
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
    const data = await this.projectPlanningSamplingService.update(
      project_id,
      sampling_id,
      projectPlanningSamplingDto,
      req.user.id,
    );
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
}
