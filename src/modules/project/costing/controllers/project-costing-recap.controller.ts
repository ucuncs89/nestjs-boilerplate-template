import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectSizeService } from '../../general/services/project-size.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';
import { ProjectCostingRecapService } from '../services/project-costing-recap.service';
import { ProjectCostingMaterialService } from '../services/project-costing-material.service';
import { ProjectMaterialItemEnum } from '../dto/project-costing-material.dto';
import { ProjectCostingVendorProductionService } from '../services/project-costing-vendor-production.service';
import { ProjectCostingShippingService } from '../services/project-costing-shipping.service';
import { ProjectCostingSamplingService } from '../services/project-costing-sampling.service';
import { ProjectCostingAdditionalCostService } from '../services/project-costing-additional-cost.service';
import { ProjectCostingPriceService } from '../services/project-costing-price.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingRecapController {
  constructor(
    private readonly projectSizeService: ProjectSizeService,
    private readonly projectVariantService: ProjectVariantService,
    private readonly projectRecapService: ProjectCostingRecapService,
    private readonly projectCostingMaterialService: ProjectCostingMaterialService,
    private readonly projectCostingVendorProductionService: ProjectCostingVendorProductionService,
    private readonly projectCostingShippingService: ProjectCostingShippingService,
    private readonly projectCostingAdditionalCostService: ProjectCostingAdditionalCostService,
    private readonly projectCostingSamplingService: ProjectCostingSamplingService,
    private readonly projectCostingPriceService: ProjectCostingPriceService,

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
      select: {
        id: true,
        status: true,
        project_price_selling: true,
        total_costing_price: true,
      },
    });
    const can_edit_costing =
      project.status === StatusProjectEnum.Costing ? true : false;
    const quantityTotalItem =
      await this.projectVariantService.sumTotalItemByProjectId(project_id);

    const fabric = await this.projectCostingMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Fabric,
    );
    const sewing = await this.projectCostingMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Sewing,
    );
    const packaging = await this.projectCostingMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Packaging,
    );
    const finishedgoods = await this.projectCostingMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Finishedgoods,
    );
    const production =
      await this.projectCostingVendorProductionService.findRecap(project_id);
    const shipping =
      await this.projectCostingShippingService.findByProjectDetailId(
        project_id,
      );
    const additional_cost =
      await this.projectCostingAdditionalCostService.findAll(project_id);
    const sampling = await this.projectCostingSamplingService.findAll(
      project_id,
    );

    const price = await this.projectCostingPriceService.findOne(project_id);

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
    data.can_edit_costing = can_edit_costing;
    if (project.status === StatusProjectEnum.Costing) {
      if (price) {
        if (price.selling_price_per_item !== project.project_price_selling) {
          project.project_price_selling = price.selling_price_per_item;
          await this.projectRepository.save(project);
        }
      }
    }
    if (data.profit_unit_all_item.total_cost_of_good_sold) {
      if (
        data.profit_unit_all_item.total_cost_of_good_sold !==
        project.total_costing_price
      ) {
        project.total_costing_price =
          data.profit_unit_all_item.total_cost_of_good_sold;
        await this.projectRepository.save(project);
      }
    }
    return { data };
  }
}
