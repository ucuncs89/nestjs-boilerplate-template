import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { Connection, IsNull, Repository, In } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectReturAdditionalCostDto } from '../dto/project-retur-additional-cost.dto';

@Injectable()
export class ProjectReturAdditionalCostService {
  constructor(
    @InjectRepository(ProjectAdditionalCostEntity)
    private projectAdditionalCostRepository: Repository<ProjectAdditionalCostEntity>,
    private connection: Connection,
  ) {}
  async findAll(project_id: number, retur_id: number) {
    const data = await this.projectAdditionalCostRepository.find({
      select: {
        id: true,
        retur_id: true,
        project_id: true,
        additional_name: true,
        additional_price: true,
        description: true,
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([StatusProjectEnum.Retur]),
        retur_id,
      },
    });
    return data;
  }
  async create(
    project_id: number,
    retur_id: number,
    projectAdditionalCostDto: ProjectReturAdditionalCostDto,
    user_id: number,
  ) {
    try {
      const data = this.projectAdditionalCostRepository.create({
        project_id,
        ...projectAdditionalCostDto,
        added_in_section: StatusProjectEnum.Retur,
        created_at: new Date().toISOString(),
        created_by: user_id,
        retur_id,
      });
      await this.projectAdditionalCostRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findOne(project_id: number, retur_id: number, additional_id: number) {
    const data = await this.projectAdditionalCostRepository.findOne({
      where: {
        id: additional_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        retur_id,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    project_id: number,
    retur_id: number,
    additional_id: number,
    projectAdditionalCostDto: ProjectReturAdditionalCostDto,
    user_id: number,
  ) {
    const data = await this.projectAdditionalCostRepository.update(
      { project_id, id: additional_id, retur_id },
      {
        ...projectAdditionalCostDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async remove(project_id: number, retur_id: number, additional_id: number) {
    const data = await this.projectAdditionalCostRepository.delete({
      project_id,
      id: additional_id,
      retur_id,
    });
    return data;
  }

  async findAdditionalRetur(project_id: number, retur_id: number) {
    const data = await this.projectAdditionalCostRepository.find({
      select: {
        id: true,
        additional_name: true,
        additional_price: true,
        description: true,
        project_id: true,
        retur_id: true,
      },
      where: {
        retur_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: In([StatusProjectEnum.Retur]),
      },
    });
    return data;
  }

  async sumGrandAvgPriceTotalAdditionalPrice(
    project_id: number,
    retur_id: number,
  ) {
    const avgPrice = await this.projectAdditionalCostRepository.average(
      'additional_price',
      {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: StatusProjectEnum.Retur,
        retur_id,
      },
    );
    const totalCost = await this.projectAdditionalCostRepository.sum(
      'additional_price',
      {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: StatusProjectEnum.Retur,
        retur_id,
      },
    );
    return {
      avg_price: avgPrice ? avgPrice : 0,
      total_cost: totalCost ? totalCost : 0,
    };
  }
}
