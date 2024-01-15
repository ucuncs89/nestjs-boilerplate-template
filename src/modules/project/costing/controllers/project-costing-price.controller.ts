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
import { ProjectCostingPriceService } from '../services/project-costing-price.service';
import { ProjectCostingPriceDto } from '../dto/project-costing-price.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingPriceController {
  constructor(
    private readonly projectCostingPriceService: ProjectCostingPriceService,
  ) {}

  @Get(':project_id/price')
  async findList(@Param('project_id') project_id: number) {
    const data = await this.projectCostingPriceService.findOne(project_id);
    return {
      data,
    };
  }
  @Post(':project_id/price')
  async postPrice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectCostingPriceDto: ProjectCostingPriceDto,
  ) {
    const data = await this.projectCostingPriceService.create(
      project_id,
      projectCostingPriceDto,
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
    @Body() projectCostingPriceDto: ProjectCostingPriceDto,
  ) {
    const data = await this.projectCostingPriceService.update(
      project_id,
      price_id,
      projectCostingPriceDto,
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
    const data = await this.projectCostingPriceService.remove(
      project_id,
      price_id,
    );
    return {
      data,
    };
  }
}
