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
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialProductionService } from '../services/project-vendor-material-production.service';
import { ProjectMaterialProductionService } from '../services/project-material-production.service';
import { ProjectVendorMaterialProductionDetailDto } from '../dto/project-vendor-material-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorMaterialProductionController {
  constructor(
    private readonly projectVendorMaterialProductionService: ProjectVendorMaterialProductionService,
    private readonly projectMaterialProductionService: ProjectMaterialProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/vendor-material')
  async getbyDetailId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const fabric =
      await this.projectMaterialProductionService.findVendorMaterialFabric(
        detail_id,
      );
    const sewing =
      await this.projectMaterialProductionService.findVendorMaterialSewing(
        detail_id,
      );
    const packaging =
      await this.projectMaterialProductionService.findVendorMaterialPackaging(
        detail_id,
      );
    const finishedGoods =
      await this.projectMaterialProductionService.findVendorMaterialFinishedGood(
        detail_id,
      );

    const data = [...finishedGoods, ...fabric, ...sewing, ...packaging];
    return { data };
  }

  @Get('production/:project_id/detail/:detail_id/vendor-material/fabric')
  async getVendorMaterialFabric(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialProductionService.findVendorMaterialFabric(
        detail_id,
      );
    return { data };
  }

  @Get('production/:project_id/detail/:detail_id/vendor-material/sewing')
  async getVendorMaterialSewing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialProductionService.findVendorMaterialSewing(
        detail_id,
      );
    return { data };
  }

  @Get('production/:project_id/detail/:detail_id/vendor-material/packaging')
  async getVendorMaterialPackaging(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialProductionService.findVendorMaterialPackaging(
        detail_id,
      );
    return { data };
  }

  @Get(
    'production/:project_id/detail/:detail_id/vendor-material/finished-goods',
  )
  async getVendorMaterialFinishedGood(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialProductionService.findVendorMaterialFinishedGood(
        detail_id,
      );
    return { data };
  }

  @Post(
    'production/:project_id/detail/:detail_id/vendor-material/:vendor_material_id',
  )
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (projectVendorMaterialProductionDetailDto.type) {
      case 'Fabric':
        data =
          await this.projectVendorMaterialProductionService.createVendorMaterialFabricDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialProductionService.createVendorMaterialSewingDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialProductionService.createVendorMaterialPackagingDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialProductionService.createVendorMaterialFinishedGoodDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;

      default:
        throw new AppErrorException(
          'TYPE ALLOWED Fabric, Sewing, Packaging, Finished goods',
        );
    }

    return { data };
  }

  @Put(
    'production/:project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async updateOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Body()
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (projectVendorMaterialProductionDetailDto.type) {
      case 'Fabric':
        data =
          await this.projectVendorMaterialProductionService.updateVendorMaterialFabricDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialProductionService.updateVendorMaterialSewingDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialProductionService.updateVendorMaterialPackagingDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialProductionService.updateVendorMaterialFinishedGoodDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialProductionDetailDto,
            req.user.id,
            i18n,
          );
        break;

      default:
        throw new AppErrorException(
          'TYPE ALLOWED Fabric, Sewing, Packaging, Finished goods',
        );
    }

    return { data };
  }

  @Delete(
    'production/:project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async deleteOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Query('type') type: string,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (type) {
      case 'Fabric':
        data =
          await this.projectVendorMaterialProductionService.deleteVendorMaterialFabricDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialProductionService.deleteVendorMaterialSewingDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialProductionService.deleteVendorMaterialPackagingDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialProductionService.deleteVendorMaterialFinishedGoodDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;

      default:
        throw new AppErrorException(
          'TYPE ALLOWED Fabric, Sewing, Packaging, Finished goods',
        );
    }
    return { data };
  }
}
