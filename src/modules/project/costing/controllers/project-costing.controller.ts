import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectCostingService } from '../services/project-costing.service';
import { ProjectHistoryService } from '../../general/services/project-history.service';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@ApiBearerAuth()
@ApiTags('project costing')
@UseGuards(JwtAuthGuard)
@Controller('project/costing')
export class ProjectCostingController {
  constructor(
    private readonly projectCostingService: ProjectCostingService,
    private readonly projectHistoryService: ProjectHistoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':project_id/generate')
  async generate(@Req() req, @Param('project_id') project_id: number) {
    const data = await this.projectCostingService.generateUpdateCosting(
      project_id,
      req.user.id,
    );
    if ((data.generate_project_costing = 'new')) {
      this.projectHistoryService.create(
        { status: StatusProjectEnum.Costing },
        project_id,
        req.user.id,
        {},
      );
    }
    return { data };
  }
}
