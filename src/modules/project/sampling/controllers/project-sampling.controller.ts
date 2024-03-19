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
import { ProjectSamplingService } from '../services/project-sampling.service';
import { ProjectSamplingDto } from '../dto/project-sampling.dto';
import { ProjectCostingSamplingService } from '../../costing/services/project-costing-sampling.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';

@ApiBearerAuth()
@ApiTags('project sampling')
@UseGuards(JwtAuthGuard)
@Controller('project/sampling')
export class ProjectSamplingController {
  constructor(
    private readonly projectSamplingService: ProjectSamplingService,
    private readonly projectCostingSamplingService: ProjectCostingSamplingService,
    private readonly projectVariantService: ProjectVariantService,
  ) {}

  @Get(':project_id')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectSamplingService.findAll(project_id);
    return {
      data,
    };
  }
  @Post(':project_id')
  async postSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectSamplingDto: ProjectSamplingDto,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item = projectSamplingDto.total_cost / variantTotalItem;
    const data = await this.projectSamplingService.create(
      project_id,
      projectSamplingDto,
      req.user.id,
      cost_per_item,
    );
    if (data) {
      this.projectCostingSamplingService.updateGrandAvgPriceTotalSampling(
        project_id,
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
    const data = await this.projectSamplingService.findOne(
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
    @Body() projectSamplingDto: ProjectSamplingDto,
  ) {
    const variantTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const cost_per_item = projectSamplingDto.total_cost / variantTotalItem;
    const data = await this.projectSamplingService.update(
      project_id,
      sampling_id,
      projectSamplingDto,
      req.user.id,
      cost_per_item,
    );
    if (data) {
      this.projectCostingSamplingService.updateGrandAvgPriceTotalSampling(
        project_id,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/sampling/:sampling_id')
  async deleteSampling(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('sampling_id') sampling_id: number,
  ) {
    const data = await this.projectSamplingService.delete(
      project_id,
      sampling_id,
      req.user.id,
    );
    if (data) {
      this.projectCostingSamplingService.updateGrandAvgPriceTotalSampling(
        project_id,
      );
    }
    return {
      data,
    };
  }

  @Get(':project_id/recap')
  async findListRecap(@Param('project_id') project_id: number) {
    const data = await this.projectSamplingService.calculateRecap(project_id);
    return {
      ...data,
    };
  }
}
