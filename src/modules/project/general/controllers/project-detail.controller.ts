import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../services/project-detail.service';
import { CreateProjectDetailDto } from '../dto/create-project-detail.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectMaterialService } from '../../planning/services/project-material.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectDetailController {
  constructor(
    private readonly projectDetailService: ProjectDetailService,
    private readonly projectMaterialService: ProjectMaterialService,
  ) {}

  @Post(':project_id/detail')
  async create(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() createProjectDetailDto: CreateProjectDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    let project_detail_id: number;

    switch (createProjectDetailDto.type) {
      case 'Planning':
        data = await this.projectDetailService.createProjectDetailPlanning(
          project_id,
          createProjectDetailDto,
          req.user.id,
          i18n,
        );
        project_detail_id = data.id;
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

          const material_source =
            await this.projectMaterialService.findMaterialSelectId(
              newProjectDetail.id,
            );

          return {
            data: newProjectDetail,
            material_source: material_source.material_source,
            generate: data,
          };
        } else {
          project_detail_id = sampling.id;
          data = sampling;
        }
        break;
      case 'Production':
        const production =
          await this.projectDetailService.findProjectDetailProduction(
            project_id,
          );

        if (!production) {
          const newProjectDetail =
            await this.projectDetailService.createProjectDetailProduction(
              project_id,
              createProjectDetailDto,
              req.user.id,
              i18n,
            );

          data = await this.projectDetailService.generateProductionProject(
            project_id,
            newProjectDetail.id,
            req.user.id,
            i18n,
          );

          const material_source =
            await this.projectMaterialService.findMaterialSelectId(
              newProjectDetail.id,
            );

          return {
            data: newProjectDetail,
            material_source: material_source.material_source,
            generate: data,
          };
        } else {
          project_detail_id = production.id;
          data = production;
        }
        break;

      default:
        throw new AppErrorException('Payload Type Project not allowed');
    }

    const material_source =
      await this.projectMaterialService.findMaterialSelectId(project_detail_id);

    return {
      data,
      material_source: material_source?.material_source || null,
      material_id: material_source?.id || null,
    };
  }
}
