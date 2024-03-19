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
import { ProjectReturStageService } from '../services/project-retur-stage.service';
import { ProjectReturService } from '../../general/services/project-retur.service';
import { ProjectReturStageDto } from '../dto/project-retur-stage.dto';

@ApiBearerAuth()
@ApiTags('project retur')
@UseGuards(JwtAuthGuard)
@Controller('project/retur')
export class ProjectReturStageController {
  constructor(
    private projectReturStageService: ProjectReturStageService,
    private projectReturService: ProjectReturService,
  ) {}

  @Get(':project_id/:retur_id/stage')
  async getReturStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturStageService.findStage(
      project_id,
      retur_id,
    );
    let sum_quantity_stage = 0;
    if (data.length > 0) {
      sum_quantity_stage = data.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    }
    const retur = await this.projectReturService.findOne(retur_id, project_id);
    const quantity_remaining = retur.quantity
      ? retur.quantity
      : 0 - sum_quantity_stage;
    return {
      data,
      total_item_variant: retur.quantity ? retur.quantity : 0,
      quantity_remaining,
      sum_quantity_stage,
    };
  }
  @Get(':project_id/:retur_id/stage/:stage_id')
  async getDetailReturStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('stage_id') stage_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturStageService.findDetailStage(
      project_id,
      stage_id,
      retur_id,
    );
    return { data };
  }
  @Post(':project_id/:retur_id/stage')
  async createReturStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
    @Body()
    projectReturStageDto: ProjectReturStageDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturStageService.createStage(
      project_id,
      projectReturStageDto,
      req.user.id,
      retur_id,
    );
    return { data };
  }
  @Put(':project_id/:retur_id/stage/:stage_id')
  async updateReturStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('stage_id') stage_id: number,
    @Param('retur_id') retur_id: number,
    @Body()
    projectReturStageDto: ProjectReturStageDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturStageService.updateStage(
      project_id,
      stage_id,
      projectReturStageDto,
      req.user.id,
      retur_id,
    );
    return { data };
  }
  @Delete(':project_id/:retur_id/stage/:stage_id')
  async deleteReturStage(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('stage_id') stage_id: number,
    @Param('retur_id') retur_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturStageService.deleteStage(
      project_id,
      stage_id,
      retur_id,
    );
    return { data };
  }
}
