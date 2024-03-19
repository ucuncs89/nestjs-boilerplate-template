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
import { ProjectDetailCalculateService } from '../../general/services/project-detail-calculate.service';
import { ProjectReturAdditionalCostService } from '../services/project-retur-additional-cost.service';
import { ProjectReturAdditionalCostDto } from '../dto/project-retur-additional-cost.dto';

@ApiBearerAuth()
@ApiTags('project retur')
@UseGuards(JwtAuthGuard)
@Controller('project/retur')
export class ProjectReturAdditionalCostController {
  constructor(
    private readonly projectReturAdditionalCostService: ProjectReturAdditionalCostService,
    private readonly projectDetailCalculateService: ProjectDetailCalculateService,
  ) {}

  @Get(':project_id/:retur_id/additional-cost')
  async findList(
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const data = await this.projectReturAdditionalCostService.findAll(
      project_id,
      retur_id,
    );

    return {
      data,
    };
  }
  @Post(':project_id/:retur_id/additional-cost')
  async postAdditionalCost(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Body()
    projectReturAdditionalCostDto: ProjectReturAdditionalCostDto,
  ) {
    const data = await this.projectReturAdditionalCostService.create(
      project_id,
      retur_id,
      projectReturAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectReturAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
          retur_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Retur,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
      );
    }
    return {
      data,
    };
  }

  @Get(':project_id/:retur_id/additional-cost/:additional_id')
  async findOneDetail(
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('additional_id') additional_id: number,
  ) {
    const data = await this.projectReturAdditionalCostService.findOne(
      project_id,
      retur_id,
      additional_id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/:retur_id/additional-cost/:additional_id')
  async updateOne(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('additional_id') additional_id: number,
    @Body()
    projectReturAdditionalCostDto: ProjectReturAdditionalCostDto,
  ) {
    const data = await this.projectReturAdditionalCostService.update(
      project_id,
      retur_id,
      additional_id,
      projectReturAdditionalCostDto,
      req.user.id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectReturAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
          retur_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Retur,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/:retur_id/additional-cost/:additional_id')
  async deleteAdditionalPrice(
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Param('additional_id') additional_id: number,
  ) {
    const data = await this.projectReturAdditionalCostService.remove(
      project_id,
      retur_id,
      additional_id,
    );
    if (data) {
      const calculateAdditionalCost =
        await this.projectReturAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
          project_id,
          retur_id,
        );
      this.projectDetailCalculateService.upsertCalculate(
        project_id,
        TypeProjectDetailCalculateEnum.AdditionalCost,
        StatusProjectEnum.Retur,
        calculateAdditionalCost.avg_price,
        calculateAdditionalCost.total_cost,
      );
    }
    return {
      data,
    };
  }
}
