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
import { CreateProjectMaterialDto } from '../dto/create-project-material.dto';
import { ProjectMaterialService } from '../services/project_material.service';
import { UpdateProjectMaterialDto } from '../dto/update-project-material.dto';
import { ProjectVariantService } from '../services/project_variant.service';
import { CreateProjectVariantDto } from '../dto/project-variant.dto';
import { ProjectVendorMaterialDto } from '../dto/project-vendor-material.dto';
import { ProjectVendorMaterialService } from '../services/project-vendor-material.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorMaterialController {
  constructor(
    private readonly projectVendorMaterialService: ProjectVendorMaterialService,
  ) {}

  @Post(':project_id/detail/:detail_id/vendor-material')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectVendorMaterialDto: ProjectVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    let vendor_fabric: any;
    let vendor_accessories_sewing: any;
    let vendor_accessories_packaging: any;
    if (
      Array.isArray(projectVendorMaterialDto.vendor_fabric) &&
      projectVendorMaterialDto.vendor_fabric
    ) {
      vendor_fabric =
        await this.projectVendorMaterialService.createVendorMaterialFabric(
          detail_id,
          projectVendorMaterialDto.vendor_fabric,
          req.user.id,
          i18n,
        );
    }
    if (
      Array.isArray(projectVendorMaterialDto.vendor_accessories_sewing) &&
      projectVendorMaterialDto.vendor_accessories_sewing
    ) {
      vendor_accessories_sewing =
        await this.projectVendorMaterialService.createVendorMaterialSewing(
          detail_id,
          projectVendorMaterialDto.vendor_accessories_sewing,
          req.user.id,
          i18n,
        );
    }
    if (
      Array.isArray(projectVendorMaterialDto.vendor_accessories_packaging) &&
      projectVendorMaterialDto.vendor_accessories_packaging
    ) {
      vendor_accessories_packaging =
        await this.projectVendorMaterialService.createVendorMaterialPackaging(
          detail_id,
          projectVendorMaterialDto.vendor_accessories_packaging,
          req.user.id,
          i18n,
        );
    }
    return {
      data: {
        vendor_fabric,
        vendor_accessories_sewing,
        vendor_accessories_packaging,
      },
    };
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
