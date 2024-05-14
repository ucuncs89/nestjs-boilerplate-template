import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectSalesService } from '../services/project-sales.service';
import { ProjectVariantService } from '../services/project-variant.service';
import { ProjectCostingPriceService } from '../../costing/services/project-costing-price.service';
import { ProjectPlanningPriceService } from '../../planning/services/project-planning-price.service';

@ApiBearerAuth()
@ApiTags('project sales')
@UseGuards(JwtAuthGuard)
@Controller('project/sales')
export class ProjectSalesController {
  constructor(
    private projectSalesService: ProjectSalesService,
    private projectVariantService: ProjectVariantService,
    private projectCostingPriceService: ProjectCostingPriceService,
    private projectPlanningPriceService: ProjectPlanningPriceService,
  ) {}
  //
  // sales quote
  //
  @Get(':project_id/sales-quote')
  async getProjectQuoteSales(@Param('project_id') project_id: number) {
    const variant_total_item =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const project_price = await this.projectCostingPriceService.findOne(
      project_id,
    );
    return {
      variant_total_item,
      price: project_price?.selling_price_per_item || 0,
    };
  }
  @Get(':project_id/sales-quote/detail')
  async getProjectQuoteSalesDetail(@Param('project_id') project_id: number) {
    const project_price = await this.projectCostingPriceService.findOne(
      project_id,
    );
    const variant = await this.projectVariantService.findVariant(project_id);
    const data = await this.projectSalesService.mappingDetailSalesQuotes(
      project_id,
      project_price?.selling_price_per_item || 0,
      variant,
    );
    return {
      data,
    };
  }

  //
  // sales order
  //
  @Get(':project_id/sales-order')
  async getProjectOrderSales(@Param('project_id') project_id: number) {
    const variant_total_item =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);
    const project_price = await this.projectPlanningPriceService.findOne(
      project_id,
    );
    return {
      variant_total_item,
      price: project_price?.selling_price_per_item || 0,
    };
  }
  @Get(':project_id/sales-order/detail')
  async getProjectOrderSalesDetail(@Param('project_id') project_id: number) {
    const project_price = await this.projectPlanningPriceService.findOne(
      project_id,
    );
    const variant = await this.projectVariantService.findVariant(project_id);
    const data = await this.projectSalesService.mappingDetailSalesOrder(
      project_id,
      project_price?.selling_price_per_item || 0,
      variant,
    );
    return {
      data,
    };
  }
}
