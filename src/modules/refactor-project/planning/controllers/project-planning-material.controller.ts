import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import {
  CreateProjectMaterialSourceDto,
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
} from '../dto/project-planning-material.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningMaterialController {
  constructor(
    private readonly projectPlanningMaterialService: ProjectPlanningMaterialService,
  ) {}

  @Post(':project_id/detail/:detail_id/material/material-source')
  async create(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectMaterialSourceDto: CreateProjectMaterialSourceDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningMaterialService.createMaterialSource(
      detail_id,
      createProjectMaterialSourceDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Post(':project_id/detail/:detail_id/material/item')
  async createMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningMaterialService.createMaterialItemOne(
        detail_id,
        projectMaterialItemDto,
        req.user.id,
      );
    return {
      data,
    };
  }
  @Get(':project_id/detail/:detail_id/material/item')
  async listMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Query() getListProjectMaterialDto: GetListProjectMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningMaterialService.listMaterialItem(
      detail_id,
      getListProjectMaterialDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Put(':project_id/detail/:detail_id/material/item/:material_item_id')
  async updateMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('material_item_id') material_item_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningMaterialService.updateMaterialItemOne(
        detail_id,
        material_item_id,
        projectMaterialItemDto,
        req.user.id,
      );
    return {
      data,
    };
  }
  @Delete(':project_id/detail/:detail_id/material/item/:material_item_id')
  async deleteMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('material_item_id') material_item_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningMaterialService.removeMaterialItemOne(
        detail_id,
        material_item_id,
        req.user.id,
      );
    return {
      data,
    };
  }
}
