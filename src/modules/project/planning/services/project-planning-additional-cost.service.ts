import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { Connection, IsNull, Repository, In, Not } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectPlanningAdditionalCostDto } from '../dto/project-planning-additional-cost.dto';

@Injectable()
export class ProjectPlanningAdditionalCostService {
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
        added_in_section: In([StatusProjectEnum.Planning]),
      },
    });
    return data;
  }
  async create(
    project_id: number,
    projectAdditionalCostDto: ProjectPlanningAdditionalCostDto,
    user_id: number,
  ) {
    try {
      const data = this.projectAdditionalCostRepository.create({
        project_id,
        ...projectAdditionalCostDto,
        added_in_section: StatusProjectEnum.Planning,
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
    projectAdditionalCostDto: ProjectPlanningAdditionalCostDto,
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

  async findAdditionalPlanning(project_id: number) {
    const data = await this.projectAdditionalCostRepository.find({
      select: {
        id: true,
        additional_name: true,
        additional_price: true,
        description: true,
        project_id: true,
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([StatusProjectEnum.Planning]),
        planning_project_additional_cost_id: IsNull(),
      },
    });
    return data;
  }

  async compareFind(project_id: number) {
    const costing = await this.projectAdditionalCostRepository.find({
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
        added_in_section: In([StatusProjectEnum.Costing]),
      },
    });
    const planning = await this.projectAdditionalCostRepository.find({
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
        added_in_section: In([StatusProjectEnum.Planning]),
      },
    });
    return { costing, planning };
  }
}
