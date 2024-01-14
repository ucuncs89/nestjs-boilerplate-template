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
import { ProjectCostingSamplingService } from '../services/project-costing-sampling.service';
import { ProjectCostingSamplingDto } from '../dto/project-costing-sampling.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingSamplingController {
  constructor(
    private readonly projectCostingSamplingService: ProjectCostingSamplingService,
  ) {}

  @Get(':project_id/sampling')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectCostingSamplingService.findAll(project_id);
    return {
      data,
    };
  }
  @Post(':project_id/sampling')
  async postSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectCostingSamplingDto: ProjectCostingSamplingDto,
  ) {
    const data = await this.projectCostingSamplingService.create(
      project_id,
      projectCostingSamplingDto,
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
    const data = await this.projectCostingSamplingService.findOne(
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
    @Body() projectCostingSamplingDto: ProjectCostingSamplingDto,
  ) {
    const data = await this.projectCostingSamplingService.update(
      project_id,
      sampling_id,
      projectCostingSamplingDto,
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
    const data = await this.projectCostingSamplingService.remove(
      project_id,
      sampling_id,
    );
    return {
      data,
    };
  }
}
