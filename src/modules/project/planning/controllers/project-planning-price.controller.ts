import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectPlanningPriceService } from '../services/project-planning-price.service';
import { ProjectPlanningPriceDto } from '../dto/project-planning-price.dto';
import { ProjectCostingPriceService } from '../../costing/services/project-costing-price.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningPriceController {
  constructor(
    private readonly projectPlanningPriceService: ProjectPlanningPriceService,
    private readonly projectCostingPriceService: ProjectCostingPriceService,
  ) {}

  @Get(':project_id/price')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectPlanningPriceService.findOne(project_id);
    return {
      data,
    };
  }
  @Post(':project_id/price')
  async postPrice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectPlanningPriceDto: ProjectPlanningPriceDto,
  ) {
    const data = await this.projectPlanningPriceService.create(
      project_id,
      projectPlanningPriceDto,
      req.user.id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/price/:price_id')
  async updateOne(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('price_id') price_id: number,
    @Body() projectPlanningPriceDto: ProjectPlanningPriceDto,
  ) {
    const data = await this.projectPlanningPriceService.update(
      project_id,
      price_id,
      projectPlanningPriceDto,
      req.user.id,
    );
    return {
      data,
    };
  }

  @Delete(':project_id/price/:price_id')
  async deletePrice(
    @Param('project_id') project_id: number,
    @Param('price_id') price_id: number,
  ) {
    const data = await this.projectPlanningPriceService.remove(
      project_id,
      price_id,
    );
    return {
      data,
    };
  }
  @Get(':project_id/price/compare')
  async findCompareList(@Param('project_id') project_id: number) {
    const costing = await this.projectCostingPriceService.findOne(project_id);
    const planning = await this.projectPlanningPriceService.findOne(project_id);
    return {
      costing,
      planning,
    };
  }
}
