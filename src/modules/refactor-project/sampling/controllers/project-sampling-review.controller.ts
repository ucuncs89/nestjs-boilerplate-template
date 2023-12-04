import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectDetailService } from '../../general/services/project-detail.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectSamplingConfirmDto } from '../dto/project-sampling-confirm.dto';

@ApiBearerAuth()
@ApiTags('Project Sampling')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectSamplingReviewController {
  constructor(private readonly projectDetailService: ProjectDetailService) {}

  @Post('sampling/:project_id/detail/:detail_id/confirmation')
  async createConfirm(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('detail_id') detail_id: number,
    @Body() projectConfirmDto: ProjectSamplingConfirmDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectDetailService.updateSamplingToProduction(
      project_id,
      detail_id,
      projectConfirmDto,
      req.user.id,
      i18n,
    );
    return { data };
  }
}
