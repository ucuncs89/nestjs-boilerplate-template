import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectSamplingEntity } from 'src/entities/project/project_sampling.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectSamplingDto } from '../dto/project-sampling.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectSamplingService {
  constructor(
    @InjectRepository(ProjectSamplingEntity)
    private projectSamplingRepository: Repository<ProjectSamplingEntity>,
    private connection: Connection,
  ) {}
  async findAll(project_id: number) {
    const data = await this.projectSamplingRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([
          StatusProjectEnum.Costing,
          StatusProjectEnum.Sampling,
        ]),
      },
    });
    return data;
  }
  async findOne(project_id: number, sampling_id: number) {
    const data = await this.projectSamplingRepository.findOne({
      where: { id: sampling_id, project_id },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async create(
    project_id: number,
    projectSamplingDto: ProjectSamplingDto,
    user_id: number,
    cost_per_item: number,
  ) {
    try {
      const sampling = this.projectSamplingRepository.create({
        ...projectSamplingDto,
        cost: cost_per_item,
        added_in_section: StatusProjectEnum.Sampling,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectSamplingRepository.save(sampling);
      return sampling;
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }
  async update(
    project_id: number,
    sampling_id: number,
    projectSamplingDto: ProjectSamplingDto,
    user_id: number,
    cost_per_item: number,
  ) {
    try {
      const data = await this.projectSamplingRepository.update(
        { id: sampling_id, project_id },
        {
          name: projectSamplingDto.name,
          total_cost: projectSamplingDto.total_cost,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          cost: cost_per_item,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async delete(project_id: number, sampling_id: number, user_id: number) {
    try {
      const data = await this.projectSamplingRepository.update(
        { id: sampling_id, project_id },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async calculateRecap(project_id: number) {
    const sampling = await this.findAll(project_id);
    if (sampling.length < 1) {
      return {
        data: sampling,
        total_cost: 0,
      };
    }
    const total_cost = sampling.reduce(
      (total, item) => total + item.total_cost,
      0,
    );
    return { data: sampling, total_cost };
  }
  async findSamplingAll(project_id: number) {
    const data = await this.projectSamplingRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([
          StatusProjectEnum.Costing,
          StatusProjectEnum.Sampling,
        ]),
        planning_project_project_sampling_id: IsNull(),
      },
    });
    return data;
  }
}
