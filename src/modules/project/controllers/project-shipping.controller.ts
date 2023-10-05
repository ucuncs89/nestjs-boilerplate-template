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
import { CreateProjectShippingDto } from '../dto/project-shipping.dto';
import { ProjectShippingService } from '../services/project-shipping.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectShippingController {
  constructor(
    private readonly projectShippingService: ProjectShippingService,
  ) {}

  @Post(':project_id/detail/:detail_id/shipping')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectShippingDto: CreateProjectShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingService.createShipping(
      detail_id,
      createProjectShippingDto,
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
