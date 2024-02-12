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
import { ProjectCostingShippingService } from '../services/project-costing-shipping.service';
import { ProjectCostingShippingDto } from '../dto/project-costing-shipping.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingShippingController {
  constructor(
    private readonly projectCostingShippingService: ProjectCostingShippingService,
  ) {}

  @Get(':project_id/shipping')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectCostingShippingService.findByProjectDetailId(
      project_id,
    );
    return { data };
  }
  @Post(':project_id/shipping')
  async createProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectCostingShippingDto: ProjectCostingShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectCostingShippingService.createShipping(
      project_id,
      projectCostingShippingDto,
      req.user.id,
    );
    if (data) {
      this.projectCostingShippingService.updateGrandAvgPriceTotalShipping(
        project_id,
      );
    }
    return { data };
  }
  @Put(':project_id/shipping/:shipping_id')
  async putProjectShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @Body()
    projectCostingShippingDto: ProjectCostingShippingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectCostingShippingService.updateShipping(
      shipping_id,
      projectCostingShippingDto,
      req.user.id,
    );
    if (data) {
      this.projectCostingShippingService.updateGrandAvgPriceTotalShipping(
        project_id,
      );
    }
    return { data };
  }
  @Get(':project_id/shipping/:shipping_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectCostingShippingService.findDetailShipping(
      shipping_id,
    );
    return { data };
  }
  @Delete(':project_id/shipping/:shipping_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('shipping_id') shipping_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectCostingShippingService.deleteShipping(
      shipping_id,
    );
    if (data) {
      this.projectCostingShippingService.updateGrandAvgPriceTotalShipping(
        project_id,
      );
    }
    return { data };
  }
}
