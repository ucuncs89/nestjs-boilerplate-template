import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectReturService } from '../services/project-retur.service';
import { ProjectReturDto } from '../dto/project-retur.dto';
import { ProjectPlanningPriceService } from '../../planning/services/project-planning-price.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectReturController {
  constructor(
    private readonly projectReturService: ProjectReturService,
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
  ) {}

  @Get(':project_id/retur')
  async findAll(
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectReturService.findAll(project_id);
    return { message: 'Successfully', data };
  }

  @Post(':project_id/retur')
  async create(
    @Req() req,
    @Body() projectReturDto: ProjectReturDto,
    @Param('project_id') project_id: number,
  ) {
    const price = await this.projectPlanningPriceService.findPricePlanning(
      project_id,
    );
    const price_per_item = price ? price.selling_price_per_item : 0;
    const data = await this.projectReturService.create(
      project_id,
      projectReturDto,
      req.user.id,
      price_per_item,
    );
    return { data };
  }

  @Get(':project_id/retur/:retur_id')
  async getOne(
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const data = await this.projectReturService.findOne(retur_id, project_id);
    return { data };
  }

  @Put(':project_id/retur/:retur_id')
  async updateRemarks(
    @Req() req,
    @Body() projectReturDto: ProjectReturDto,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const data = await this.projectReturService.update(
      retur_id,
      project_id,
      projectReturDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(':project_id/retur/:retur_id')
  async deleteRemarks(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const data = await this.projectReturService.remove(
      retur_id,
      project_id,
      req.user.id,
    );
    return { data };
  }
}
