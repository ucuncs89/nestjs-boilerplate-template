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
import { ProjectVendorMaterialSamplingService } from '../services/project-vendor-material-sampling.service';
import { ProjectMaterialSamplingService } from '../services/project-material-sampling.service';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialSamplingDetailDto } from '../dto/project-vendor-material-fabric-sampling.dto';

@ApiBearerAuth()
@ApiTags('Project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVendorMaterialSamplingController {
  constructor(
    private readonly projectVendorMaterialSamplingService: ProjectVendorMaterialSamplingService,
    private readonly projectMaterialSamplingService: ProjectMaterialSamplingService,
  ) {}

  @Get('sampling/:project_id/detail/:detail_id/vendor-material')
  async getbyDetailId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const fabric =
      await this.projectMaterialSamplingService.findVendorMaterialFabric(
        detail_id,
      );
    const sewing =
      await this.projectMaterialSamplingService.findVendorMaterialSewing(
        detail_id,
      );
    const packaging =
      await this.projectMaterialSamplingService.findVendorMaterialPackaging(
        detail_id,
      );
    const finishedGoods =
      await this.projectMaterialSamplingService.findVendorMaterialFinishedGood(
        detail_id,
      );

    const data = [...finishedGoods, ...fabric, ...sewing, ...packaging];
    return { data };
  }

  @Get('sampling/:project_id/detail/:detail_id/vendor-material/fabric')
  async getVendorMaterialFabric(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialSamplingService.findVendorMaterialFabric(
        detail_id,
      );
    return { data };
  }

  @Get('sampling/:project_id/detail/:detail_id/vendor-material/sewing')
  async getVendorMaterialSewing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialSamplingService.findVendorMaterialSewing(
        detail_id,
      );
    return { data };
  }

  @Get('sampling/:project_id/detail/:detail_id/vendor-material/packaging')
  async getVendorMaterialPackaging(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialSamplingService.findVendorMaterialPackaging(
        detail_id,
      );
    return { data };
  }

  @Get('sampling/:project_id/detail/:detail_id/vendor-material/finished-goods')
  async getVendorMaterialFinishedGood(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectMaterialSamplingService.findVendorMaterialFinishedGood(
        detail_id,
      );
    return { data };
  }

  @Post(
    'sampling/:project_id/detail/:detail_id/vendor-material/:vendor_material_id',
  )
  async createOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Body()
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (projectVendorMaterialSamplingDetailDto.type) {
      case 'Fabric':
        data =
          await this.projectVendorMaterialSamplingService.createVendorMaterialFabricDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialSamplingService.createVendorMaterialSewingDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialSamplingService.createVendorMaterialPackagingDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialSamplingService.createVendorMaterialPackagingDetail(
            detail_id,
            vendor_material_id,
            projectVendorMaterialSamplingDetailDto,
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
    'sampling/:project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
  )
  async updateOneVendorMaterialDetail(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('vendor_material_id') vendor_material_id: number,
    @Param('vendor_material_detail_id') vendor_material_detail_id: number,
    @Body()
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (projectVendorMaterialSamplingDetailDto.type) {
      case 'Fabric':
        data =
          await this.projectVendorMaterialSamplingService.updateVendorMaterialFabricDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialSamplingService.updateVendorMaterialSewingDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialSamplingService.updateVendorMaterialPackagingDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialSamplingDetailDto,
            req.user.id,
            i18n,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialSamplingService.updateVendorMaterialFinishedGoodDetail(
            detail_id,
            vendor_material_detail_id,
            projectVendorMaterialSamplingDetailDto,
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
    'sampling/:project_id/detail/:detail_id/vendor-material/:vendor_material_id/detail/:vendor_material_detail_id',
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
          await this.projectVendorMaterialSamplingService.deleteVendorMaterialFabricDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Sewing':
        data =
          await this.projectVendorMaterialSamplingService.deleteVendorMaterialSewingDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Packaging':
        data =
          await this.projectVendorMaterialSamplingService.deleteVendorMaterialPackagingDetail(
            vendor_material_id,
            vendor_material_detail_id,
          );
        break;
      case 'Finished goods':
        data =
          await this.projectVendorMaterialSamplingService.deleteVendorMaterialFinishedGoodDetail(
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
