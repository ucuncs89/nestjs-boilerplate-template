import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository, In } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectSamplingEntity } from 'src/entities/project/project_sampling.entity';
import { ProjectPlanningSamplingDto } from '../dto/project-planning-sampling.dto';

@Injectable()
export class ProjectPlanningSamplingService {
  constructor(
    @InjectRepository(ProjectSamplingEntity)
    private projectSamplingRepository: Repository<ProjectSamplingEntity>,
    private connection: Connection,
  ) {}

  async findAll(project_id: number) {
    const data = await this.projectSamplingRepository.find({
      select: {
        id: true,
        name: true,
        cost: true,
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([StatusProjectEnum.Planning]),
      },
    });
    return data;
  }
  async create(
    project_id: number,
    projectPlanningSamplingDto: ProjectPlanningSamplingDto,
    user_id: number,
  ) {
    try {
      const data = this.projectSamplingRepository.create({
        project_id,
        ...projectPlanningSamplingDto,
        added_in_section: StatusProjectEnum.Planning,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectSamplingRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findOne(project_id: number, sampling_id: number) {
    const data = await this.projectSamplingRepository.findOne({
      where: {
        id: sampling_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    project_id: number,
    sampling_id: number,
    projectPlanningSamplingDto: ProjectPlanningSamplingDto,
    user_id: number,
  ) {
    const data = await this.projectSamplingRepository.update(
      { project_id, id: sampling_id },
      {
        ...projectPlanningSamplingDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async remove(project_id: number, sampling_id: number) {
    const data = await this.projectSamplingRepository.delete({
      project_id,
      id: sampling_id,
    });
    return data;
  }
}
