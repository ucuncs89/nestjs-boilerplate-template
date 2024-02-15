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
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectPlanningVendorMaterialService } from '../services/project-planning-vendor-material.service';
import { ProjectPlanningVendorMaterialDto } from '../dto/project-planning-vendor-material.dto';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import { AppErrorException } from 'src/exceptions/app-exception';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningVendorMaterialController {
  constructor(
    private projectPlanningVendorMaterialService: ProjectPlanningVendorMaterialService,
    private projectPlanningMaterialService: ProjectPlanningMaterialService,
  ) {}

  @Post(':project_id/vendor-material/:vendor_material_id')
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const material =
      await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
        vendor_material_id,
      );
    if (!material) {
      throw new AppErrorException(
        'vendor_material_id and material_id cannot relate',
      );
    }
    const data =
      await this.projectPlanningVendorMaterialService.createVendorMaterialDetail(
        project_id,
        vendor_material_id,
        projectPlanningVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
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
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorMaterialService.updateVendorMaterialDetail(
        project_id,
        vendor_material_detail_id,
        projectPlanningVendorMaterialDto,
        req.user.id,
        i18n,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
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
      await this.projectPlanningVendorMaterialService.deleteVendorMaterialDetail(
        vendor_material_id,
        vendor_material_detail_id,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateTotalQuantitySubtotal(
        vendor_material_id,
      );
      const material =
        await this.projectPlanningMaterialService.findMaterilIdByMaterialVendor(
          vendor_material_id,
        );
      await this.projectPlanningMaterialService.updateTotalPlanningAndAvgCost(
        material,
      );
    }
    return { data };
  }
}
