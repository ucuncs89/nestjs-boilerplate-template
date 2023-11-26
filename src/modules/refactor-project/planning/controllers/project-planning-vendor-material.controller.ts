import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListProjectMaterialDto } from '../dto/project-planning-material.dto';
import { ProjectPlanningVendorMaterialService } from '../services/project-planning-vendor-material.service';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningVendorMaterialController {
  constructor(
    private projectPlanningVendorMaterialService: ProjectPlanningVendorMaterialService,
  ) {}

  @Get(':project_id/detail/:detail_id/vendor-material')
  async getList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Query() getListProjectMaterialDto: GetListProjectMaterialDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectPlanningVendorMaterialService.findVendorMaterialItem(
        detail_id,
        getListProjectMaterialDto,
        req.user.id,
      );
    return { data };
  }
}
