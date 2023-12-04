import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectProductionShippingService } from '../services/project-production-shipping.service';
import { ProjectProductionShippingDto } from '../dto/project-production-shipping.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionShippingController {
  constructor(
    private readonly projectProductionShippingService: ProjectProductionShippingService,
  ) {}

  @Get(':project_id/detail/:detail_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionShippingService.findByProjectDetailId(
        detail_id,
      );
    return { data };
  }
  @Post(':project_id/detail/:detail_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectProductionShippingDto: ProjectProductionShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.createShipping(
      detail_id,
      projectProductionShippingDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectProductionShippingDto: ProjectProductionShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.updateShipping(
      shipping_id,
      projectProductionShippingDto,
      req.user.id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/shipping/:shipping_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }
  @Delete(':project_id/detail/:detail_id/shipping/:shipping_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.deleteShipping(
      shipping_id,
    );
    return { data };
  }
}
