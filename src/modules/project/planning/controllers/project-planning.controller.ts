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
import { ProjectHistoryService } from '../../general/services/project-history.service';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningService } from '../services/project-planning.service';
import { ProjectService } from '../../general/services/project.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningController {
  constructor(
    private readonly projectPlanningService: ProjectPlanningService,
    private readonly projectHistoryService: ProjectHistoryService,
    private readonly projectService: ProjectService,
  ) {}

  @Post(':project_id/generate')
  async generate(@Req() req, @Param('project_id') project_id: number) {
    const project = await this.projectService.findOne(project_id, {});
    if (project.status === StatusProjectEnum.Planning) {
      return { data: true };
    }
    const data = await this.projectPlanningService.generatePlanning(project_id);
    return { data };
  }
  //   @Post(':project_id/publish')
  //   async publish(@Req() req, @Param('project_id') project_id: number) {
  //     const data = await this.projectCostingService.publishCosting(
  //       project_id,
  //       req.user.id,
  //     );
  //     return { data };
  //   }
}
