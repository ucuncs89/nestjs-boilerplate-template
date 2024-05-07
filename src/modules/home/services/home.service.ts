import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Between, In, IsNull, Not, Repository } from 'typeorm';
import { HomeDto } from '../dto/home.dto';
import { StatusProjectEnum } from 'src/modules/project/general/dto/get-list-project.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async getFindHome(query: HomeDto) {
    const start_date = query.start_date
      ? query.start_date
      : new Date('1970-01-01').toISOString();
    const end_date = query.end_date ? query.end_date : new Date().toISOString();
    const number_of_project_count = await this.projectRepository.count({
      where: {
        status: Not(In([StatusProjectEnum.Draft])),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_completed_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Complete]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_in_progress_count = await this.projectRepository.count({
      where: {
        status: In([
          StatusProjectEnum.Costing,
          StatusProjectEnum.Sampling,
          StatusProjectEnum.Planning,
          StatusProjectEnum.Production,
        ]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_canceled_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Canceled]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_holded_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Hold]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_costing_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_sampling_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Sampling]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_planning_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    const project_production_count = await this.projectRepository.count({
      where: {
        status: In([StatusProjectEnum.Production]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        created_at: Between(start_date, end_date),
      },
    });
    return {
      number_of_project_count,
      project_completed_count,
      project_in_progress_count,
      project_canceled_count,
      project_holded_count,
      project_costing_count,
      project_sampling_count,
      project_planning_count,
      project_production_count,
    };
  }
}
