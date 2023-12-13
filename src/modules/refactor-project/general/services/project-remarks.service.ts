import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRemarksEntity } from 'src/entities/project/project_remark.entity';
import { Repository } from 'typeorm';
import {
  GetListProjectRemarksDto,
  ProjectRemarksDto,
} from '../dto/project-remarks.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

Injectable();
export class ProjectRemarksService {
  constructor(
    @InjectRepository(ProjectRemarksEntity)
    private projectRemarksRepository: Repository<ProjectRemarksEntity>,
  ) {}

  async findAll(query: GetListProjectRemarksDto, project_id: number) {
    const { page, page_size, sort_by, order_by } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [results, total] = await this.projectRemarksRepository.findAndCount({
      select: {
        id: true,
        project_id: true,
        description: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
      where: { project_id },
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      results,
      total_data: total,
    };
  }
  async findOne(remarks_id: number) {
    const data = await this.projectRemarksRepository.findOne({
      where: {
        id: remarks_id,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async createProjectRemarks(
    project_id: number,
    projectRemarksDto: ProjectRemarksDto,
    user_id: number,
  ) {
    try {
      const projectRemarks = this.projectRemarksRepository.create({
        ...projectRemarksDto,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectRemarksRepository.save(projectRemarks);
      return projectRemarks;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateProjectRemarks(
    project_id: number,
    remarks_id: number,
    projectRemarksDto: ProjectRemarksDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectRemarksRepository.update(
        {
          project_id,
          id: remarks_id,
        },
        {
          description: projectRemarksDto.description,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteProjectRemarks(project_id: number, remarks_id: number) {
    try {
      const data = await this.projectRemarksRepository.delete({
        id: remarks_id,
        project_id,
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
