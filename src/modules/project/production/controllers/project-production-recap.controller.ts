import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectVariantService } from '../../general/services/project-variant.service';
import { ProjectPlanningPriceService } from '../../planning/services/project-planning-price.service';
import { ProjectPlanningRecapController } from '../../planning/controllers/project-planning-recap.controller';
import { ProjectProductionAdditionalCostService } from '../services/project-production-additional-cost.service';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/production')
export class ProjectProductionRecapController {
  constructor(
    private readonly projectVariantService: ProjectVariantService,
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
    private readonly projectProductionAdditionalCostService: ProjectProductionAdditionalCostService,
    private readonly projectPlanningRecapController: ProjectPlanningRecapController,
  ) {}
  @Get(':project_id/recap/calculate')
  async recapCalculate(@Param('project_id') project_id: number) {
    const quantity_order =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const project_price = await this.projectPlanningPriceService.findOne(
      project_id,
    );
    const selling_price = project_price?.selling_price_per_item || 0;
    const sales = selling_price * quantity_order;
    const calculatePlanning =
      await this.projectPlanningRecapController.recapCalculate(project_id);
    const cost_of_good_sold =
      calculatePlanning.data?.cost_of_good_sold?.total_cost || 0;
    const cost_of_good_sold_all_item = quantity_order * cost_of_good_sold;
    const additional_cost_in_production =
      await this.projectProductionAdditionalCostService.sumGrandAvgPriceTotalAdditionalPrice(
        project_id,
      );
    const profit_unit = calculatePlanning.data.profit_unit;
    const profit_loss_unit = profit_unit ? profit_unit.profit_loss_unit : 0;
    const profit_loss_all_item =
      profit_loss_unit * quantity_order +
      additional_cost_in_production.total_cost;
    const data = {
      cost_of_good_sold,
      cost_of_good_sold_all_item,
      quantity_order,
      selling_price,
      sales,
      additional_cost_in_production,
      profit_loss_unit,
      profit_loss_all_item,
    };
    return {
      data,
    };
  }
}
