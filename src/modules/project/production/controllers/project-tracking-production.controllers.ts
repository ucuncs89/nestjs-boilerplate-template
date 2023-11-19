import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
  Put,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectTrackingProductionService } from '../services/project-tracking-production.service';

@ApiBearerAuth()
@ApiTags('Project Production')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectTrackingProductionController {
  constructor(
    private readonly projectTrackingProductionService: ProjectTrackingProductionService,
  ) {}

  @Post(
    'production/:project_id/detail/:detail_id/vendor-production/:project_vendor_id/tracking/:vendor_production_detail_id',
  )
  async createVendorProductionActivityName(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('project_vendor_id') project_vendor_id: number,
    @Param('vendor_production_detail_id') vendor_production_detail_id: number,
    @Query('production_is_completed')
    production_is_completed: boolean,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectTrackingProductionService.updateIsCompletedProduction(
        vendor_production_detail_id,
        production_is_completed,
        req.user.id,
      );
    return { data };
  }
}
