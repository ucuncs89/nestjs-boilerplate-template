import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../services/project-detail.service';
import { CreateProjectDetailDto } from '../dto/create-project-detail.dto';
import { AppErrorException } from 'src/exceptions/app-exception';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectDetailController {
  constructor(private readonly projectDetailService: ProjectDetailService) {}

  @Post(':project_id/detail')
  async create(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() createProjectDetailDto: CreateProjectDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (createProjectDetailDto.type) {
      case 'Planning':
        data = await this.projectDetailService.createProjectDetailPlanning(
          project_id,
          createProjectDetailDto,
          req.user.id,
          i18n,
        );
        break;
      case 'Sampling':
        const sampling =
          await this.projectDetailService.findProjectDetailSampling(project_id);
        if (!sampling) {
          const newProjectDetail =
            await this.projectDetailService.createProjectDetailSampling(
              project_id,
              createProjectDetailDto,
              req.user.id,
              i18n,
            );
          data = await this.projectDetailService.generateSamplingProject(
            project_id,
            newProjectDetail.id,
            req.user.id,
            i18n,
          );
          return { data: newProjectDetail, generate: data };
        } else {
          data = sampling;
        }
        break;
      default:
        throw new AppErrorException('Payload Type Project not allowed');
    }
    return { data };
  }
}
