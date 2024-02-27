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
import { ProjectService } from '../../general/services/project.service';
import { ProjectProductionService } from '../services/project-production.service';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/prodution')
export class ProjectProductionController {
  constructor(
    private readonly projectHistoryService: ProjectHistoryService,
    private readonly projectProductionService: ProjectProductionService,
  ) {}

  @Post(':project_id/generate')
  async generate(@Req() req, @Param('project_id') project_id: number) {
    // const data = await this.projectProductionService.generateProduction(
    //   project_id,
    //   req.user.id,
    // );
    // this.projectHistoryService.create(
    //   { status: StatusProjectEnum.Production },
    //   project_id,
    //   req.user.id,
    //   {},
    // );
    return { data: 'belum' };
  }
  // @Post(':project_id/publish')
  // async publish(@Req() req, @Param('project_id') project_id: number) {
  //   const data = await this.projectPlanningService.publishPlanning(
  //     project_id,
  //     req.user.id,
  //   );
  //   return { data };
  // }
}
