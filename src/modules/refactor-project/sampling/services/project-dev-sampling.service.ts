import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectSamplingStatusEntity } from 'src/entities/project/project_sampling_status.entity';
import { ProjectSetSamplingEntity } from 'src/entities/project/project_set_sampling.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';

import { ProjectSamplingRevisiEntity } from 'src/entities/project/project_sampling_revisi.entity';
import {
  ProjectSamplingDevSamplingDto,
  ProjectSamplingSamplingRevisiDto,
} from '../dto/project-sampling-dev-sampling.dto';

@Injectable()
export class ProjectDevSamplingService {
  constructor(
    @InjectRepository(ProjectSetSamplingEntity)
    private projectSetSamplingRepository: Repository<ProjectSetSamplingEntity>,

    @InjectRepository(ProjectSamplingStatusEntity)
    private projectSamplingStatusRepository: Repository<ProjectSamplingStatusEntity>,

    @InjectRepository(ProjectSamplingRevisiEntity)
    private projectSamplingRevisiRepository: Repository<ProjectSamplingRevisiEntity>,

    private connection: Connection,
  ) {}

  async findSampling(project_detail_id: number) {
    const data = await this.projectSetSamplingRepository.findOne({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        is_completed: true,
        sampling_date: true,
        sampling_price: true,
        project_detail_id: true,
        project_sampling_status: {
          id: true,
          status: true,
          is_validate: true,
          project_set_sampling_id: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
        },
        project_sampling_revisi: {
          id: true,
          title: true,
          description: true,
          project_set_sampling_id: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
        },
      },
      relations: {
        project_sampling_status: true,
        project_sampling_revisi: true,
      },
      order: {
        id: 'DESC',
        project_sampling_status: { id: 'ASC' },
        project_sampling_revisi: { id: 'ASC' },
      },
    });
    return data;
  }
  async generateDevSampling(project_detail_id, user_id) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const setSampling = await queryRunner.manager.insert(
        ProjectSetSamplingEntity,
        {
          project_detail_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      await queryRunner.manager.insert(ProjectSamplingStatusEntity, [
        {
          project_set_sampling_id: setSampling.raw[0].id,
          status: 'Memulai proses sampling',
        },
        {
          project_set_sampling_id: setSampling.raw[0].id,
          status: 'Produksi sampling',
        },
        {
          project_set_sampling_id: setSampling.raw[0].id,
          status: 'Review ke buyer',
        },
        {
          project_set_sampling_id: setSampling.raw[0].id,
          status: 'PP Sampling',
        },
        {
          project_set_sampling_id: setSampling.raw[0].id,
          status: 'Selesai',
        },
      ]);
      await queryRunner.commitTransaction();
      return this.findSampling(project_detail_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new AppErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async updateDevSampling(
    project_detail_id,
    project_sampling_id,
    projectDevSamplingDto: ProjectSamplingDevSamplingDto,
    user_id,
  ) {
    const data = await this.projectSetSamplingRepository.update(
      {
        project_detail_id,
        id: project_sampling_id,
      },
      {
        ...projectDevSamplingDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async updateSamplingStatus(
    project_sampling_id,
    sampling_status_id,
    is_validate,
    user_id,
  ) {
    const data = await this.projectSamplingStatusRepository.update(
      {
        project_set_sampling_id: project_sampling_id,
        id: sampling_status_id,
      },
      {
        is_validate,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async createRevisiSampling(
    project_sampling_id,
    projectSamplingRevisiDto: ProjectSamplingSamplingRevisiDto,
    user_id,
  ) {
    const data = this.projectSamplingRevisiRepository.create({
      project_set_sampling_id: project_sampling_id,
      ...projectSamplingRevisiDto,
      created_at: new Date().toISOString(),
      created_by: user_id,
    });
    await this.projectSamplingRevisiRepository.save(data);
    return data;
  }
  async updateRevisiSampling(
    project_sampling_id,
    revisi_id,
    projectSamplingRevisiDto: ProjectSamplingSamplingRevisiDto,
    user_id,
  ) {
    const data = await this.projectSamplingRevisiRepository.update(
      {
        project_set_sampling_id: project_sampling_id,
        id: revisi_id,
      },
      {
        ...projectSamplingRevisiDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async deleteRevisiSampling(project_sampling_id, revisi_id, user_id) {
    const data = await this.projectSamplingRevisiRepository.delete({
      project_set_sampling_id: project_sampling_id,
      id: revisi_id,
    });
    return data;
  }
}
