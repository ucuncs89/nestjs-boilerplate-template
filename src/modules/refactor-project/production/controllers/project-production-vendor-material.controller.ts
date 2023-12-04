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
import { ProjectProductionVendorMaterialService } from '../services/project-production-vendor-material.service';
import {
  GetListProjectProductionVendorMaterialDto,
  ProjectProductionVendorMaterialDto,
} from '../dto/project-production-vendor-material.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionVendorMaterialController {
  constructor(
    private projectProductionVendorMaterialService: ProjectProductionVendorMaterialService,
  ) {}

  @Get(':project_id/detail/:detail_id/vendor-material')
  async getList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Query()
    getListProjectMaterialDto: GetListProjectProductionVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorMaterialService.findVendorMaterialItem(
        detail_id,
        getListProjectMaterialDto,
        req.user.id,
      );
    return { data };
  }
  @Post(':project_id/detail/:detail_id/vendor-material/:vendor_material_id')
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectProductionVendorMaterialDto: ProjectProductionVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorMaterialService.createVendorMaterialDetail(
        detail_id,
        vendor_material_id,
        projectProductionVendorMaterialDto,
        req.user.id,
        i18n,
      );

    return { data };
  }
  @Put(
    ':project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async updateOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Body()
    projectProductionVendorMaterialDto: ProjectProductionVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorMaterialService.updateVendorMaterialDetail(
        detail_id,
        vendor_material_detail_id,
        projectProductionVendorMaterialDto,
        req.user.id,
        i18n,
      );
    return { data };
  }
  @Delete(
    ':project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async deleteOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionVendorMaterialService.deleteVendorMaterialDetail(
        vendor_material_id,
        vendor_material_detail_id,
      );
    return { data };
  }
}
