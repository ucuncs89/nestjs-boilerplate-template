import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
  Put,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectVariantService } from '../services/project-variant.service';
import { ProjectVariantDto } from '../dto/project-variant.dto';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectVariantController {
  constructor(private readonly projectVariantService: ProjectVariantService) {}

  @Post(':project_id/variant')
  async createVariant(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectVariantDto: ProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.creteOneVariant(
      project_id,
      projectVariantDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Get(':project_id/variant')
  async getList(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    let size_remaining;
    const data = await this.projectVariantService.findVariant(project_id);
    return {
      data,
      size_remaining,
    };
  }

  @Get(':project_id/variant/:variant_id')
  async listVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('variant_id') variant_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.findOneVariant(
      project_id,
      variant_id,
    );
    return {
      data,
    };
  }
  @Put(':project_id/variant/:variant_id')
  async updateVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('variant_id') variant_id: number,
    @Body() projectVariantDto: ProjectVariantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.updateOneVariant(
      project_id,
      variant_id,
      projectVariantDto,
      req.user.id,
    );
    return {
      data,
    };
  }
  @Delete(':project_id/variant/:variant_id')
  async deleteVariantItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('variant_id') variant_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectVariantService.removeVariantById(
      project_id,
      variant_id,
      req.user.id,
    );
    return {
      data,
    };
  }
}
