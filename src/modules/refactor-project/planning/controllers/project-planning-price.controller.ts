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
import { ProjectPlanningShippingService } from '../services/project-planning-shipping.service';
import { ProjectPlanningPriceService } from '../services/project-planning-price.service';
import {
  ProjectPlanningPriceAdditionalDto,
  ProjectPlanningPriceDto,
} from '../dto/project-planning-price.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningPriceController {
  constructor(
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
  ) {}

  @Get(':project_id/detail/:detail_id/price')
  async getShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningPriceService.findProjectPrice(
      detail_id,
    );
    return { data };
  }
  @Post(':project_id/detail/:detail_id/price')
  async postShipping(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectPlanningPriceDto: ProjectPlanningPriceDto,
    @I18n() i18n: I18nContext,
  ) {
    const findPrice = await this.projectPlanningPriceService.findProjectPrice(
      detail_id,
    );
    if (!findPrice) {
      const data = await this.projectPlanningPriceService.createProjectPrice(
        detail_id,
        projectPlanningPriceDto,
        req.user.id,
        i18n,
      );
      return { data };
    } else {
      const data = await this.projectPlanningPriceService.updatePrice(
        detail_id,
        findPrice.id,
        projectPlanningPriceDto,
        req.user.id,
      );
      return { data };
    }
  }
  @Post(':project_id/detail/:detail_id/price/:price_id/additional')
  async createProjectCostPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('price_id') price_id: number,
    @Body()
    projectPlanningPriceAdditionalDto: ProjectPlanningPriceAdditionalDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningPriceService.createPriceAdditional(
      price_id,
      projectPlanningPriceAdditionalDto,
      req.user.id,
    );
    return { data };
  }
  @Get(
    ':project_id/detail/:detail_id/price/:price_id/additional/:additional_price_id',
  )
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningPriceService.findDetailPriceAdditional(
        additional_price_id,
      );
    return { data };
  }
  @Put(
    ':project_id/detail/:detail_id/price/:price_id/additional/:additional_price_id',
  )
  async putProjectPriceadditional(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('price_id') price_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @Body()
    projectPlanningPriceAdditionalDto: ProjectPlanningPriceAdditionalDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningPriceService.updatePriceAdditional(
      price_id,
      additional_price_id,
      projectPlanningPriceAdditionalDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(
    ':project_id/detail/:detail_id/price/:price_id/additional/:additional_price_id',
  )
  async deleteDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('additional_price_id') additional_price_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningPriceService.deletePriceAdditional(
      additional_price_id,
    );
    return { data };
  }
}
