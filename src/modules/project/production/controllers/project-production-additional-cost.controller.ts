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
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectProductionAdditionalCostService } from '../services/project-production-additional-cost.service';
import { ProjectProductionAdditionalCostDto } from '../dto/project-production-additional-cost.dto';
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/production')
export class ProjectProductionAdditionalCostController {
  constructor(
    private readonly projectProductionAdditionalCostService: ProjectProductionAdditionalCostService,
    private readonly projectDetailCalculateService: ProjectDetailCalculateService,
  ) {}

  @Get(':project_id/additional-cost')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectProductionAdditionalCostService.findAll(
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
    @Body()
    projectProductionAdditionalCostDto: ProjectProductionAdditionalCostDto,
  ) {
    const data = await this.projectProductionAdditionalCostService.create(
      project_id,
      projectProductionAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectProductionAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Production,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
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
    const data = await this.projectProductionAdditionalCostService.findOne(
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
    @Body()
    projectProductionAdditionalCostDto: ProjectProductionAdditionalCostDto,
  ) {
    const data = await this.projectProductionAdditionalCostService.update(
      project_id,
      additional_id,
      projectProductionAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectProductionAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Production,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
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
    const data = await this.projectProductionAdditionalCostService.remove(
      project_id,
      additional_id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectProductionAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Production,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
      );
    }
    return {
      data,
    };
  }
}
