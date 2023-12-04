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
import { ProjectProductionPriceService } from '../services/project-production-price.service';
import { ProjectProductionPriceCostDto } from '../dto/project-production-price.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionPriceController {
  constructor(
    private readonly projectProductionPriceService: ProjectProductionPriceService,
  ) {}

  @Get(':project_id/detail/:detail_id/price')
  async getPriceadditionalAll(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const price =
      await this.projectProductionPriceService.findAndGeneratePriceId(
        detail_id,
        req.user.id,
      );
    if (!price) {
      return { data: null };
    }
    const additional = await this.projectProductionPriceService.findByPriceId(
      price.id,
    );
    return { data: { ...price, additional } };
  }
  @Post(':project_id/detail/:detail_id/price')
  async createProjectCostPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectProductionPriceCostDto: ProjectProductionPriceCostDto,
    @I18n() i18n: I18nContext,
  ) {
    const price =
      await this.projectProductionPriceService.findAndGeneratePriceId(
        detail_id,
        req.user.id,
      );
    const data = await this.projectProductionPriceService.createProjectAdd(
      price.id,
      projectProductionPriceCostDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/price/:additional_price_id')
  async putProjectPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @Body()
    projectProductionPriceCostDto: ProjectProductionPriceCostDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionPriceService.updatePriceAdditional(
      additional_price_id,
      projectProductionPriceCostDto,
      req.user.id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/price/:additional_price_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionPriceService.findDetailPriceAdditional(
        additional_price_id,
      );
    return { data };
  }
  @Delete(':project_id/detail/:detail_id/price/:additional_price_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionPriceService.deletePriceAdditional(
      additional_price_id,
    );
    return { data };
  }
}
