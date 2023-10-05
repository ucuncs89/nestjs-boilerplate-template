import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectVendorMaterialDto } from '../dto/project-vendor-material.dto';
import { ProjectVendorProductionService } from '../services/project-vendor-production.service';
import { ProjectVendorProductionDto } from '../dto/project-vendor-production.dto';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorProductionController {
  constructor(
    private readonly projectVendorProductionService: ProjectVendorProductionService,
  ) {}

  @Post(':project_id/detail/:detail_id/vendor-production')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectVendorProductionDto: ProjectVendorProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVendorProductionService.createVendorProduction(
        detail_id,
        projectVendorProductionDto,
        req.user.id,
        i18n,
      );

    return { data };
  }

  //   @Get(':project_id/detail/:detail_id/variant')
  //   async getbyDetailId(
  //     @Req() req,
  //     @Param('project_id') project_id: number,
  //     @Param('detail_id') detail_id: number,
  //     @I18n() i18n: I18nContext,
  //   ) {
  //     const data = await this.projectVariantService.findByProjectDetail(
  //       project_id,
  //       detail_id,
  //     );
  //     return { data };
  //   }

  //   @Get(':project_id/detail/:detail_id/material/:material_id')
  //   async getbyMaterialId(
  //     @Req() req,
  //     @Param('project_id') project_id: number,
  //     @Param('detail_id') detail_id: number,
  //     @Param('material_id') material_id: number,
  //     @I18n() i18n: I18nContext,
  //   ) {
  //     const data = await this.projectMaterialService.findDetailbyMaterialId(
  //       project_id,
  //       detail_id,
  //       material_id,
  //     );
  //     return { data };
  //   }

  //   @Put(':project_id/detail/:detail_id/variant')
  //   async updateMaterial(
  //     @Req() req,
  //     @Param('project_id') project_id: number,
  //     @Param('detail_id') detail_id: number,
  //     @Body() createProjectVariantDto: CreateProjectVariantDto,
  //     @I18n() i18n: I18nContext,
  //   ) {
  //     const data = await this.projectVariantService.updateProjectVariant(
  //       project_id,
  //       detail_id,
  //       createProjectVariantDto,
  //       req.user.id,
  //       i18n,
  //     );
  //     return { data };
  //   }
}
