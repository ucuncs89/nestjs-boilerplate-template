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
    let vendor_finished_good: any;
    if (
      Array.isArray(projectVendorMaterialDto.vendor_fabric) &&
      projectVendorMaterialDto.vendor_fabric.length > 0
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
      projectVendorMaterialDto.vendor_accessories_sewing.length > 0
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
      projectVendorMaterialDto.vendor_accessories_packaging.length > 0
    ) {
      vendor_accessories_packaging =
        await this.projectVendorMaterialService.createVendorMaterialPackaging(
          detail_id,
          projectVendorMaterialDto.vendor_accessories_packaging,
          req.user.id,
          i18n,
        );
    }

    if (
      Array.isArray(projectVendorMaterialDto.vendor_finished_good) &&
      projectVendorMaterialDto.vendor_finished_good.length > 0
    ) {
      vendor_finished_good =
        await this.projectVendorMaterialService.createVendorMaterialFinishedGood(
          detail_id,
          projectVendorMaterialDto.vendor_finished_good,
          req.user.id,
          i18n,
        );
    }

    return {
      data: {
        vendor_fabric,
        vendor_accessories_sewing,
        vendor_accessories_packaging,
        vendor_finished_good,
      },
    };
  }

  @Get(':project_id/detail/:detail_id/vendor-material')
  async getbyDetailId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const vendor_fabric =
      await this.projectVendorMaterialService.findVendorMaterialFabric(
        detail_id,
      );

    const vendor_accessories_sewing =
      await this.projectVendorMaterialService.findVendorMaterialSewing(
        detail_id,
      );
    const vendor_accessories_packaging =
      await this.projectVendorMaterialService.findVendorMaterialPackaging(
        detail_id,
      );
    return {
      vendor_fabric,
      vendor_accessories_sewing,
      vendor_accessories_packaging,
    };
  }
}
