import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateProjectMaterialDto } from '../dto/create-project-material.dto';
import { ProjectMaterialService } from '../services/project-material.service';
import { UpdateProjectMaterialDto } from '../dto/update-project-material.dto';

@ApiBearerAuth()
@ApiTags('Project Planning')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectMaterialController {
  constructor(
    private readonly projectMaterialService: ProjectMaterialService,
  ) {}

  @Post(':project_id/detail/:detail_id/material')
  async createMaterial(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectMaterialDto: CreateProjectMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.createDetailMaterial(
      project_id,
      detail_id,
      createProjectMaterialDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/material')
  async getbyDetailId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findByProjectDetail(
      project_id,
      detail_id,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/material/:material_id')
  async getbyMaterialId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('material_id') material_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findDetailbyMaterialId(
      project_id,
      detail_id,
      material_id,
    );
    return { data };
  }

  // @Put(':project_id/detail/:detail_id/material/:material_id')
  // async updateMaterial(
  //   @Req() req,
  //   @Param('project_id') project_id: number,
  //   @Param('detail_id') detail_id: number,
  //   @Param('material_id') material_id: number,
  //   @Body() updateProjectMaterialDto: UpdateProjectMaterialDto,
  //   @I18n() i18n: I18nContext,
  // ) {
  //   const materialId = await this.projectMaterialService.findMaterialSelectId(
  //     detail_id,
  //   );

  //   if (
  //     materialId.material_source !== updateProjectMaterialDto.material_source
  //   ) {
  //     this.projectMaterialService.transactionDelete(detail_id);
  //   }
  //   const data = await this.projectMaterialService.transactionUpdate(
  //     detail_id,
  //     material_id,
  //     updateProjectMaterialDto,
  //     req.user.id,
  //     i18n,
  //   );

  //   return { data };
  // }

  @Get(':project_id/detail/:detail_id/material-fabric-variant')
  async getFabricVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findProjectFabricVariant(
      detail_id,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/material-sewing-variant')
  async getSewingVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findProjectSewingVariant(
      detail_id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/material-packaging-variant')
  async getPackagingVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectMaterialService.findProjectPackagingVariant(
      detail_id,
    );
    return { data };
  }

  @Put(':project_id/detail/:detail_id/material/:material_id/transaction')
  async updateMaterialTransaction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('material_id') material_id: number,
    @Body() updateProjectMaterialDto: UpdateProjectMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const materialId = await this.projectMaterialService.findMaterialSelectId(
      detail_id,
    );
    if (
      materialId.material_source !== updateProjectMaterialDto.material_source
    ) {
      this.projectMaterialService.transactionDelete(detail_id);
    }
    const data = await this.projectMaterialService.transactionUpdate(
      detail_id,
      material_id,
      updateProjectMaterialDto,
      req.user.id,
      i18n,
    );

    return { data };
  }
}
