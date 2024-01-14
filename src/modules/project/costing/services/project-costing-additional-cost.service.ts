import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { Connection, IsNull, Repository, In } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectCostingAdditionalCostDto } from '../dto/project-costing-additional-cost.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class ProjectCostingAdditionalCostService {
  constructor(
    @InjectRepository(ProjectAdditionalCostEntity)
    private projectAdditionalCostRepository: Repository<ProjectAdditionalCostEntity>,
    private connection: Connection,
  ) {}
  async findAll(project_id: number) {
    const data = await this.projectAdditionalCostRepository.find({
      select: {
        id: true,
        additional_name: true,
        additional_price: true,
        description: true,
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        section_type: In([StatusProjectEnum.Costing]),
      },
    });
    return data;
  }
  async create(
    project_id: number,
    projectAdditionalCostDto: ProjectCostingAdditionalCostDto,
    user_id: number,
  ) {
    try {
      const data = this.projectAdditionalCostRepository.create({
        project_id,
        ...projectAdditionalCostDto,
        section_type: StatusProjectEnum.Costing,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectAdditionalCostRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findOne(project_id: number, additional_id: number) {
    const data = await this.projectAdditionalCostRepository.findOne({
      where: {
        id: additional_id,
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
    additional_id: number,
    projectAdditionalCostDto: ProjectCostingAdditionalCostDto,
    user_id: number,
  ) {
    const data = await this.projectAdditionalCostRepository.update(
      { project_id, id: additional_id },
      {
        ...projectAdditionalCostDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async remove(project_id: number, additional_id: number) {
    const data = await this.projectAdditionalCostRepository.delete({
      project_id,
      id: additional_id,
    });
    return data;
  }
}
