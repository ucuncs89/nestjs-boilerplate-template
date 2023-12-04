import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectProductionConfirmationService } from '../services/project-production-confirmation.service';

@ApiBearerAuth()
@ApiTags('refactor-project Production')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/production')
export class ProjectProductionConfirmationController {
  constructor(
    private readonly projectProductionConfirmationService: ProjectProductionConfirmationService,
  ) {}

  @Get(':project_id/detail/:detail_id/confirmation')
  async getConfirmation(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const is_delivered =
      await this.projectProductionConfirmationService.checkDelivered(detail_id);
    const is_arrived_destination =
      await this.projectProductionConfirmationService.checkArrivedDestination(
        detail_id,
      );
    const is_invoice_paid =
      await this.projectProductionConfirmationService.checkInvoicePaid(
        detail_id,
      );
    return {
      message: 'belum ini masih dummy',
      data: { is_delivered, is_arrived_destination, is_invoice_paid },
    };
  }
}
