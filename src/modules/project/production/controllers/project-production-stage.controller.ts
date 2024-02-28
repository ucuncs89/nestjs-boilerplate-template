import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectProductionStageService } from '../services/project-production-stage.service';
import { ProjectProductionStageDto } from '../dto/project-production-stage.dto';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/production')
export class ProjectProductionStageController {
  constructor(
    private projectProductionStageService: ProjectProductionStageService,
  ) {}

  @Get(':project_id/stage')
  async getProductionStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionStageService.findStage(project_id);

    return { data };
  }
  @Post(':project_id/stage')
  async createProductionStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body()
    projectProductionStageDto: ProjectProductionStageDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionStageService.createStage(
      project_id,
      projectProductionStageDto,
      req.user.id,
    );
    return { data };
  }
  @Put(':project_id/stage/:stage_id')
  async updateProductionStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('stage_id') stage_id: number,
    @Body()
    projectProductionStageDto: ProjectProductionStageDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionStageService.updateStage(
      project_id,
      stage_id,
      projectProductionStageDto,
      req.user.id,
    );
    return { data };
  }
  @Delete(':project_id/stage/:stage_id')
  async deleteProductionStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('stage_id') stage_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectProductionStageService.deleteStage(
      project_id,
      stage_id,
    );
    return { data };
  }
}
