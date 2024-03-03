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
import { ProjectProductionShippingPackingDto } from '../dto/project-production-shipping-packing.dto';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/production')
export class ProjectProductionShippingController {
  constructor(
    private readonly projectProductionShippingService: ProjectProductionShippingService,
  ) {}

  @Get(':project_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.findShipping(
      project_id,
    );
    return {
      data,
    };
  }
  @Post(':project_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectProductionShippingDto: ProjectProductionShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.createShipping(
      project_id,
      projectProductionShippingDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
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
  @Get(':project_id/shipping/:shipping_id')
  async getDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }
  @Delete(':project_id/shipping/:shipping_id')
  async deleteDetailProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.deleteShipping(
      shipping_id,
    );
    return { data };
  }

  @Post(':project_id/shipping/:shipping_id/packing-list')
  async postPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.createPackingList(
      shipping_id,
      projectProductionShippingPackingDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/shipping/:shipping_id/packing-list/:packing_id')
  async putPackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,
    @Body()
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.updatePackingList(
      shipping_id,
      packing_id,
      projectProductionShippingPackingDto,
      req.user.id,
    );
    return { data };
  }
  @Delete(':project_id/shipping/:shipping_id/packing-list/:packing_id')
  async deletePackingList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Param('packing_id') packing_id: number,

    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionShippingService.deletePackingList(
      shipping_id,
      packing_id,
      req.user.id,
    );
    return { data };
  }
}
