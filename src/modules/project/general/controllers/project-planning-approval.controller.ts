import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('project planning-approval')
@UseGuards(JwtAuthGuard)
@Controller('project/planning-approval')
export class ProjectPlanningApprovalController {
  @Get(':project_id')
  async findAll(@Param('project_id') project_id: number) {}

  @Get(':project_id/detail/:relation_id')
  async getDetailApproval(
    @Param('project_id') project_id: number,
    @Param('relation_id') relation_id: number,
    @Query('type') type,
  ) {}
}
