import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectSizeService } from '../../general/services/project-size.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';
import { ProjectCostingRecapService } from '../services/project-costing-recap.service';
import { ProjectCostingMaterialService } from '../services/project-costing-material.service';
import { ProjectMaterialItemEnum } from '../dto/project-costing-material.dto';

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
      ProjectMaterialItemEnum.Sewing,
    );
    const finishedgoods = await this.projectCostingMaterialService.findRecap(
      project_id,
      ProjectMaterialItemEnum.Finishedgoods,
    );
    const data = await this.projectRecapService.calculateRecap(
      fabric,
      sewing,
      packaging,
      finishedgoods,
    );
    return { data };
  }
}
