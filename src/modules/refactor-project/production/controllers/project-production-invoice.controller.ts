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
import { ProjectProductionInvoiceService } from '../services/project-production-invoice.service';
import { ProjectProductionInvoiceDto } from '../dto/project-production-invoice.dto';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionInvoiceController {
  constructor(
    private readonly projectProductionInvoiceService: ProjectProductionInvoiceService,
  ) {}

  @Get(':project_id/detail/:detail_id/invoice')
  async getInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectProductionInvoiceService.findByProjectDetailId(
        detail_id,
      );
    return { data };
  }
  @Post(':project_id/detail/:detail_id/invoice')
  async createProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body()
    projectProductionInvoiceDto: ProjectProductionInvoiceDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionInvoiceService.createInvoice(
      detail_id,
      projectProductionInvoiceDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/detail/:detail_id/invoice/:invoice_id')
  async putProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('invoice_id') invoice_id: number,
    @Body()
    projectProductionInvoiceDto: ProjectProductionInvoiceDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionInvoiceService.updateInvoice(
      invoice_id,
      projectProductionInvoiceDto,
      req.user.id,
    );
    return { data };
  }
  @Get(':project_id/detail/:detail_id/invoice/:invoice_id')
  async getDetailProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('invoice_id') invoice_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionInvoiceService.findDetailInvoice(
      invoice_id,
    );
    return { data };
  }
}
