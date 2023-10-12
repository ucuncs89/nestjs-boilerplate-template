import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateProjectDetailDto } from '../dto/create-project-detail.dto';
import { ProjectConfirmDto } from '../dto/project-confirm.dto';

@Injectable()
export class ProjectDetailService {
  constructor(
    @InjectRepository(ProjectDetailEntity)
    private projectDetailRepository: Repository<ProjectDetailEntity>,
    private connection: Connection,
  ) {}

  async createProjectDetailPlanning(
    project_id,
    createProjectDetailDto: CreateProjectDetailDto,
    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Planning',
      },
    });
    if (!data) {
      const data = this.projectDetailRepository.create({
        ...createProjectDetailDto,
        created_at: new Date().toISOString(),
        created_by: user_id,
        project_id,
      });
      await this.projectDetailRepository.save(data);
      return data;
    }
    return data;
  }

  async updateIsSampling(id, is_sampling) {
    return await this.projectDetailRepository.update(
      { id },
      {
        is_sampling,
      },
    );
  }
  async updateIsConfirm(
    project_id: number,
    id: number,
    projectConfirmDto: ProjectConfirmDto,
  ) {
    return await this.projectDetailRepository.update(
      {
        project_id,
        id,
      },
      {
        is_confirm: projectConfirmDto.is_confirmation,
        status: projectConfirmDto.status,
      },
    );
  }
}
