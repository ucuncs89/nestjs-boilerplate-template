import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectSetSamplingEntity } from 'src/entities/project/project_set_sampling.entity';
import {
  CreateProjectSetSamplingDto,
  UpdateProjectSetSamplingDto,
} from '../dto/project-set-sampling.dto';

@Injectable()
export class ProjectSetSamplingService {
  constructor(
    @InjectRepository(ProjectSetSamplingEntity)
    private projectSetSamplingRepository: Repository<ProjectSetSamplingEntity>,
    private connection: Connection,
  ) {}

  async createSetSampling(
    project_detail_id,
    createProjectSetSamplingDto: CreateProjectSetSamplingDto,
    user_id,
    i18n,
  ) {
    try {
      const sampling = this.projectSetSamplingRepository.create({
        project_detail_id,
        sampling_date: createProjectSetSamplingDto.is_sampling
          ? createProjectSetSamplingDto.sampling_date
          : null,
        sampling_price: createProjectSetSamplingDto.is_sampling
          ? createProjectSetSamplingDto.sampling_price
          : null,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectSetSamplingRepository.save(sampling);
      return sampling;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findProjectSetSamplingOne(project_detail_id: number) {
    const data = await this.projectSetSamplingRepository.query(`select
     "project_set_sampling"."id",
     "project_set_sampling"."project_detail_id",
     "project_set_sampling"."sampling_date",
     "project_set_sampling"."sampling_price",
     "project_detail"."is_sampling"
   from
     "project_set_sampling" "project_set_sampling"
   left join "project_detail" "project_detail" on
     "project_set_sampling"."project_detail_id" = "project_detail"."id"
   where
     "project_set_sampling"."project_detail_id" = ${project_detail_id}`);

    return data[0] ? data[0] : null;
  }
  async updateProjectShipping(
    project_detail_id,
    id: number,
    updateProjectSetSamplingDto: UpdateProjectSetSamplingDto,
    user_id,
    i18n,
  ) {
    try {
      const sampling = await this.projectSetSamplingRepository.update(
        {
          id,
        },
        {
          sampling_date: updateProjectSetSamplingDto.is_sampling
            ? updateProjectSetSamplingDto.sampling_date
            : null,
          sampling_price: updateProjectSetSamplingDto.is_sampling
            ? updateProjectSetSamplingDto.sampling_price
            : null,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { project_detail_id, id, ...updateProjectSetSamplingDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
