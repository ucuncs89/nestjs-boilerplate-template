import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectInvoiceProductionService } from '../services/project-invoice-production.service';
import { ProjectInvoiceProductionDto } from '../dto/project-invoice-production.dto';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectInvoiceProductionController {
  constructor(
    private readonly projectInvoiceProductionService: ProjectInvoiceProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/invoice')
  async getInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectInvoiceProductionService.findByProjectDetailId(
        detail_id,
      );
    return { data };
  }
  @Post('production/:project_id/detail/:detail_id/invoice')
  async createProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectInvoiceProductionDto: ProjectInvoiceProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectInvoiceProductionService.createInvoice(
      project_id,
      detail_id,
      projectInvoiceProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Put('production/:project_id/detail/:detail_id/invoice/:invoice_id')
  async putProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('invoice_id') invoice_id: number,
    @Body()
    projectInvoiceProductionDto: ProjectInvoiceProductionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectInvoiceProductionService.updateInvoice(
      invoice_id,
      projectInvoiceProductionDto,
      req.user.id,
    );
    return { data };
  }
  @Get('production/:project_id/detail/:detail_id/invoice/:invoice_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('invoice_id') invoice_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectInvoiceProductionService.findDetailInvoice(
      invoice_id,
    );
    return { data };
  }
}
