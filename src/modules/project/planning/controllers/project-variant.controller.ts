import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectVariantService } from '../services/project-variant.service';
import { CreateProjectVariantDto } from '../dto/project-variant.dto';

@ApiBearerAuth()
@ApiTags('Project Planning')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVariantController {
  constructor(private readonly projectVariantService: ProjectVariantService) {}

  @Post(':project_id/detail/:detail_id/variant')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectVariantDto: CreateProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.createProjectVariant(
      project_id,
      detail_id,
      createProjectVariantDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get(':project_id/detail/:detail_id/variant')
  async getbyDetailId(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.findByProjectDetail(
      project_id,
      detail_id,
    );
    return { data };
  }

  @Put(':project_id/detail/:detail_id/variant')
  async updateMaterial(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectVariantDto: CreateProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.updateProjectVariant(
      project_id,
      detail_id,
      createProjectVariantDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Put(':project_id/detail/:detail_id/variant/transaction')
  async puProjectVariantTransaction(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() createProjectVariantDto: CreateProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data =
      await this.projectVariantService.updateProjectVariantTransaction(
        project_id,
        detail_id,
        createProjectVariantDto,
        req.user.id,
        i18n,
      );
    return { data };
  }
}
