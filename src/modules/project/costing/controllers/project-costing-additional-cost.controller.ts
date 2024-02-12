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
import { ProjectCostingAdditionalCostService } from '../services/project-costing-additional-cost.service';
import { ProjectCostingAdditionalCostDto } from '../dto/project-costing-additional-cost.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingAdditionalCostController {
  constructor(
    private readonly projectCostingAdditionalCostService: ProjectCostingAdditionalCostService,
  ) {}

  @Get(':project_id/additional-cost')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectCostingAdditionalCostService.findAll(
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
    @Body() projectCostingAdditionalCostDto: ProjectCostingAdditionalCostDto,
  ) {
    const data = await this.projectCostingAdditionalCostService.create(
      project_id,
      projectCostingAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      this.projectCostingAdditionalCostService.updateGrandAvgPriceTotalAdditionalPrice(
        project_id,
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
    const data = await this.projectCostingAdditionalCostService.findOne(
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
    @Body() projectCostingAdditionalCostDto: ProjectCostingAdditionalCostDto,
  ) {
    const data = await this.projectCostingAdditionalCostService.update(
      project_id,
      additional_id,
      projectCostingAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      this.projectCostingAdditionalCostService.updateGrandAvgPriceTotalAdditionalPrice(
        project_id,
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
    const data = await this.projectCostingAdditionalCostService.remove(
      project_id,
      additional_id,
    );
    if (data) {
      this.projectCostingAdditionalCostService.updateGrandAvgPriceTotalAdditionalPrice(
        project_id,
      );
    }
    return {
      data,
    };
  }
}
