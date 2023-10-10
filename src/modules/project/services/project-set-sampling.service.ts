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
        sampling_date: createProjectSetSamplingDto.sampling_date,
        sampling_price: createProjectSetSamplingDto.sampling_price,
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
    const data = await this.projectSetSamplingRepository.findOne({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_detail_id: true,
        sampling_date: true,
        sampling_price: true,
      },
    });
    return data;
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
          sampling_date: updateProjectSetSamplingDto.sampling_date,
          sampling_price: updateProjectSetSamplingDto.sampling_price,
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
