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
import { ProjectShippingProductionService } from '../services/project-shipping-production.service';
import { ProjectShippingProductionDto } from '../dto/project-shipping-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectShippingProductionController {
  constructor(
    private readonly projectShippingProductionService: ProjectShippingProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectShippingProductionService.findByProjectDetailId(
        detail_id,
      );
    return { data };
  }
  @Post('production/:project_id/detail/:detail_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectShippingProductionDto: ProjectShippingProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingProductionService.createShipping(
      detail_id,
      projectShippingProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Put('production/:project_id/detail/:detail_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectShippingProductionDto: ProjectShippingProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingProductionService.updateShipping(
      shipping_id,
      projectShippingProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Get('production/:project_id/detail/:detail_id/shipping/:shipping_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingProductionService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }
  @Delete('production/:project_id/detail/:detail_id/shipping/:shipping_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectShippingProductionService.deleteShipping(
      shipping_id,
    );
    return { data };
  }
}
