import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectConfirmationProductionService } from '../services/project-confirmation-production.service';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectConfirmationProductionController {
  constructor(
    private readonly projectConfirmationProductionService: ProjectConfirmationProductionService,
  ) {}

  @Get('production/:project_id/detail/:detail_id/confirmation')
  async getConfirmation(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const is_delivered =
      await this.projectConfirmationProductionService.checkDelivered(detail_id);
    const is_arrived_destination =
      await this.projectConfirmationProductionService.checkArrivedDestination(
        detail_id,
      );
    const is_invoice_paid =
      await this.projectConfirmationProductionService.checkInvoicePaid(
        detail_id,
      );
    return {
      message: 'belum ini masih dummy',
      data: { is_delivered, is_arrived_destination, is_invoice_paid },
    };
  }
}
