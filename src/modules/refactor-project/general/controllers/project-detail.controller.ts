import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../services/project-detail.service';
import { CreateProjectDetailDto } from '../dto/create-project-detail.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
// import { ProjectMaterialService } from '../../planning/services/project-material.service';

@ApiBearerAuth()
@ApiTags('refactor-project')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project')
export class ProjectDetailController {
  constructor(
    private readonly projectDetailService: ProjectDetailService, // private readonly projectMaterialService: ProjectMaterialService,
  ) {}

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
          data = await this.projectDetailService.generateSamplingProject(
            project_id,
            req.user.id,
            i18n,
          );

          return {
            data,
          };
        } else {
          data = sampling;
        }
        break;
      case 'Production':
        const production =
          await this.projectDetailService.findProjectDetailProduction(
            project_id,
          );

        if (!production) {
          data = await this.projectDetailService.generateProductionProject(
            project_id,

            req.user.id,
            i18n,
          );
          return {
            data,
          };
        } else {
          data = production;
        }
        break;

      default:
        throw new AppErrorException('Payload Type Project not allowed');
    }
    return {
      data,
    };
  }
}
