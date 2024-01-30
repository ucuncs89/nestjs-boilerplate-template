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
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import {
  GetListProjectPlanningMaterialDto,
  ProjectPlanningMaterialItemDto,
} from '../dto/project-planning-material.dto';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/plannning')
export class ProjectPlanningMaterialController {
  constructor(
    private readonly projectPlanningMaterialService: ProjectPlanningMaterialService,
  ) {}

  @Get(':project_id/material')
  async listMaterialItem(
    @Param('project_id') project_id: number,
    @Query()
    getListProjectPlanningMaterialDto: GetListProjectPlanningMaterialDto,
  ) {
    const data = await this.projectPlanningMaterialService.findAllMaterialItem(
      project_id,
      getListProjectPlanningMaterialDto,
    );
    return {
      data,
    };
  }
  @Post(':project_id/material')
  async createMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectPlanningMaterialItemDto: ProjectPlanningMaterialItemDto,
  ) {
    const data =
      await this.projectPlanningMaterialService.createMaterialItemOne(
        project_id,
        projectPlanningMaterialItemDto,
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
    const data = await this.projectPlanningMaterialService.findOneMaterialItem(
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
    @Body() projectPlanningMaterialItemDto: ProjectPlanningMaterialItemDto,
  ) {
    const data =
      await this.projectPlanningMaterialService.updateMaterialItemOne(
        project_id,
        material_item_id,
        projectPlanningMaterialItemDto,
        req.user.id,
      );
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
    const data =
      await this.projectPlanningMaterialService.deleteMaterialItemOne(
        project_id,
        material_item_id,
        req.user.id,
      );
    return {
      data,
    };
  }
}
