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

import { ProjectPlanningVariantService } from '../services/project-planning-variant.service';
import { ProjectVariantDto } from '../dto/project-planning-variant.dto';
import { ProjectService } from '../../general/services/project.service';

@ApiBearerAuth()
@ApiTags('refactor-project Planning')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project/planning')
export class ProjectPlanningVariantController {
  constructor(
    private readonly projectPlanningVariantService: ProjectPlanningVariantService,
    private readonly projectService: ProjectService,
  ) {}

  @Post(':project_id/detail/:detail_id/variant')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectVariantDto: ProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningVariantService.creteOneVariant(
      detail_id,
      projectVariantDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Get(':project_id/detail/:detail_id/variant')
  async getList(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    let size_remaining;
    const projectSize = await this.projectService.findSize(project_id);
    const data = await this.projectPlanningVariantService.findVariant(
      detail_id,
    );
    if (projectSize.data.length < 1) {
      size_remaining = [];
    } else {
      size_remaining =
        await this.projectPlanningVariantService.calculateSizeRemaining(
          data,
          projectSize,
        );
    }

    return {
      data,
      size_remaining,
    };
  }

  @Get(':project_id/detail/:detail_id/variant/:variant_id')
  async listVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('variant_id') variant_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningVariantService.findOneVarinat(
      detail_id,
      variant_id,
    );
    return {
      data,
    };
  }
  @Put(':project_id/detail/:detail_id/variant/:variant_id')
  async updateVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('variant_id') variant_id: number,
    @Body() projectVariantDto: ProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningVariantService.updateOneVariant(
      detail_id,
      variant_id,
      projectVariantDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Delete(':project_id/detail/:detail_id/variant/:variant_id')
  async deleteVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Param('variant_id') variant_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningVariantService.removeVariantById(
      detail_id,
      variant_id,
      req.user.id,
    );
    return {
      data,
    };
  }
}
