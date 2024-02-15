import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectCostingVendorMaterialService } from '../services/project-costing-vendor-material.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectCostingVendorMaterialDto } from '../dto/project-costing-vendor-material.dto';
import { ProjectCostingMaterialService } from '../services/project-costing-material.service';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingVendorMaterialController {
  constructor(
    private projectCostingVendorMaterialService: ProjectCostingVendorMaterialService,
    private projectCostingMaterialService: ProjectCostingMaterialService,
  ) {}

  @Post(':project_id/vendor-material/:vendor_material_id')
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectCostingVendorMaterialDto: ProjectCostingVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const material =
      await this.projectCostingMaterialService.findMaterilIdByMaterialVendor(
        vendor_material_id,
      );
    if (!material) {
      throw new AppErrorException(
        'vendor_material_id and material_id cannot relate',
      );
    }
    const data =
      await this.projectCostingVendorMaterialService.createVendorMaterialDetail(
        project_id,
        vendor_material_id,
        projectCostingVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectCostingVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );

      await this.projectCostingMaterialService.updateTotalCostingAndAvgCost(
        material,
      );
    }
    return { data };
  }
  @Put(
    ':project_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async updateOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Body()
    projectCostingVendorMaterialDto: ProjectCostingVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectCostingVendorMaterialService.updateVendorMaterialDetail(
        project_id,
        vendor_material_detail_id,
        projectCostingVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectCostingVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectCostingMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectCostingMaterialService.updateTotalCostingAndAvgCost(
        material,
      );
    }
    return { data };
  }
  @Delete(
    ':project_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async deleteOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectCostingVendorMaterialService.deleteVendorMaterialDetail(
        vendor_material_id,
        vendor_material_detail_id,
      );
    if (data) {
      await this.projectCostingVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectCostingMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectCostingMaterialService.updateTotalCostingAndAvgCost(
        material,
      );
    }
    return { data };
  }
}
