import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { IsNull, Repository } from 'typeorm';
import { ProjectSizeDto } from '../dto/create-project.dto';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class ProjectSizeService {
  constructor(
    @InjectRepository(ProjectSizeEntity)
    private projectSizeRepository: Repository<ProjectSizeEntity>,
  ) {}
  async create(
    project_id: number,
    projectSizeDto: ProjectSizeDto,
    user_id: number,
  ) {
    try {
      const size = this.projectSizeRepository.create({
        project_id,
        size_ratio: projectSizeDto.size_ratio,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectSizeRepository.save(size);
      return size;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findAllProjectSize(project_id) {
    const data = await this.projectSizeRepository.find({
      select: { id: true, project_id: true, size_ratio: true },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async updateProjectSize(
    size_id: number,
    project_id: number,
    projectSizeDto: ProjectSizeDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectSizeRepository.update(
        {
          project_id,
          id: size_id,
        },
        {
          size_ratio: projectSizeDto.size_ratio,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteProjectSize(
    size_id: number,
    project_id: number,
    user_id: number,
  ) {
    try {
      const data = await this.projectSizeRepository.update(
        {
          project_id,
          id: size_id,
        },
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
}
