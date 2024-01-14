import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}

  async generateUpdateCosting(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: project_id,
      },
    });

    if (project.status === 'Project Created') {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          status: StatusProjectEnum.Costing,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { generate_project_costing: 'new', data };
    }
    return { generate_project_costing: 'old' };
  }
}
