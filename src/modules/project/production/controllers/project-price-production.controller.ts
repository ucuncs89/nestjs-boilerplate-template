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
import { ProjectPriceProductionService } from '../services/project-price-production.service';
import { ProjectPriceCostProductionDto } from '../dto/project-price-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectPriceProductionController {
  constructor(
    private readonly projectPriceProductionService: ProjectPriceProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/price')
  async getPriceadditionalAll(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const price =
      await this.projectPriceProductionService.findAndGeneratePriceId(
        detail_id,
        req.user.id,
      );
    if (!price) {
      return { data: null };
    }
    const additional = await this.projectPriceProductionService.findByPriceId(
      price.id,
    );
    return { data: { ...price, additional } };
  }
  @Post('production/:project_id/detail/:detail_id/price')
  async createProjectCostPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectPriceCostProductionDto: ProjectPriceCostProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const price =
      await this.projectPriceProductionService.findAndGeneratePriceId(
        detail_id,
        req.user.id,
      );
    const data = await this.projectPriceProductionService.createProjectAdd(
      price.id,
      projectPriceCostProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Put('production/:project_id/detail/:detail_id/price/:additional_price_id')
  async putProjectPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @Body()
    projectPriceCostProductionDto: ProjectPriceCostProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPriceProductionService.updatePriceAdditional(
      additional_price_id,
      projectPriceCostProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Get('production/:project_id/detail/:detail_id/price/:additional_price_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPriceProductionService.findDetailPriceAdditional(
        additional_price_id,
      );
    return { data };
  }
  @Delete('production/:project_id/detail/:detail_id/price/:additional_price_id')
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPriceProductionService.deletePriceAdditional(
      additional_price_id,
    );
    return { data };
  }
}
