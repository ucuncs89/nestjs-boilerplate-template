import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectSizeService } from '../../general/services/project-size.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';
import { ProjectPlanningRecapService } from '../services/project-planning-recap.service';
import { ProjectPlanningVendorProductionService } from '../services/project-planning-vendor-production.service';
import { ProjectPlanningShippingService } from '../services/project-planning-shipping.service';
import { ProjectPlanningAdditionalCostService } from '../services/project-planning-additional-cost.service';
import { ProjectPlanningSamplingService } from '../services/project-planning-sampling.service';
import { ProjectPlanningPriceService } from '../services/project-planning-price.service';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import { ProjectMaterialItemEnum } from '../dto/project-planning-material.dto';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectService } from '../../general/services/project.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningRecapController {
  constructor(
    private readonly projectSizeService: ProjectSizeService,
    private readonly projectVariantService: ProjectVariantService,
    private readonly projectRecapService: ProjectPlanningRecapService,
    private readonly projectPlanningMaterialService: ProjectPlanningMaterialService,
    private readonly projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,
    private readonly projectPlanningShippingService: ProjectPlanningShippingService,
    private readonly projectPlanningAdditionalCostService: ProjectPlanningAdditionalCostService,
    private readonly projectPlanningSamplingService: ProjectPlanningSamplingService,
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
    private readonly projectService: ProjectService,

    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  @Get(':project_id/recap/size-quantity')
  async findSizeQuantity(@Param('project_id') project_id: number) {
    const data = await this.projectSizeService.findAllProjectSize(project_id);
    return { data: data };
  }
  @Get(':project_id/recap/variant')
  async findVariant(@Param('project_id') project_id: number) {
    const data = await this.projectVariantService.findVariant(project_id);
    return { data };
  }
  @Get(':project_id/recap/calculate')
  async recapCalculate(@Param('project_id') project_id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: project_id,
      },
      select: { id: true, status: true, total_planning_price: true },
    });
    const quantityTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);

    const fabric = await this.projectPlanningMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Fabric,
    );
    const sewing = await this.projectPlanningMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Sewing,
    );
    const packaging = await this.projectPlanningMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Packaging,
    );
    const finishedgoods = await this.projectPlanningMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Finishedgoods,
    );
    const production =
      await this.projectPlanningVendorProductionService.findRecap(project_id);
    const shipping =
      await this.projectPlanningShippingService.findByProjectDetailId(
        project_id,
      );
    const additional_cost =
      await this.projectPlanningAdditionalCostService.findAll(project_id);
    const sampling = await this.projectPlanningSamplingService.findAll(
      project_id,
    );

    const price = await this.projectPlanningPriceService.findOne(project_id);
    const data = await this.projectRecapService.calculateRecap(
      quantityTotalItem,
      fabric,
      sewing,
      packaging,
      finishedgoods,
      production,
      shipping,
      additional_cost,
      sampling,
      price,
    );

    if (data.profit_unit_all_item.total_cost_of_good_sold) {
      if (
        data.profit_unit_all_item.total_cost_of_good_sold !==
        project.total_planning_price
      ) {
        this.projectService.updateTotalPlanningPrice(
          project_id,
          data.profit_unit_all_item.total_cost_of_good_sold,
        );
      }
    }
    return { data };
  }
}
