import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

import {
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
} from '../dto/project-costing-material.dto';
import { ProjectCostingMaterialService } from '../services/project-costing-material.service';
import { ProjectCostingVendorMaterialService } from '../services/project-costing-vendor-material.service';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingMaterialController {
  constructor(
    private readonly projectCostingMaterialService: ProjectCostingMaterialService,
    private readonly projectCostingVendorMaterialService: ProjectCostingVendorMaterialService,
  ) {}

  @Get(':project_id/material')
  async listMaterialItem(
    @Param('project_id') project_id: number,
    @Query() getListProjectMaterialDto: GetListProjectMaterialDto,
  ) {
    const data = await this.projectCostingMaterialService.findAllMaterialItem(
      project_id,
      getListProjectMaterialDto,
    );
    return {
      data,
    };
  }
  @Post(':project_id/material')
  async createMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
  ) {
    const data = await this.projectCostingMaterialService.createMaterialItemOne(
      project_id,
      projectMaterialItemDto,
      req.user.id,
    );
    return {
      data,
    };
  }

  @Get(':project_id/material/:material_item_id')
  async findOneMaterialItem(
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
  ) {
    const data = await this.projectCostingMaterialService.findOneMaterialItem(
      project_id,
      material_item_id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/material/:material_item_id')
  async updateOneMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
  ) {
    const data = await this.projectCostingMaterialService.updateMaterialItemOne(
      project_id,
      material_item_id,
      projectMaterialItemDto,
      req.user.id,
    );
    if (data) {
      await this.projectCostingVendorMaterialService.updateQuantityPriceUnitByMaterialId(
        material_item_id,
        projectMaterialItemDto.consumption_unit,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/material/:material_item_id')
  async deleteOneMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
  ) {
    const data = await this.projectCostingMaterialService.deleteMaterialItemOne(
      project_id,
      material_item_id,
      req.user.id,
    );
    return {
      data,
    };
  }
}
