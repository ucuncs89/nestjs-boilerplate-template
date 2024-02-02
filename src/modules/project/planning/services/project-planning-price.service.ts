import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository, In } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningPriceDto } from '../dto/project-planning-price.dto';

@Injectable()
export class ProjectPlanningPriceService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,
    private connection: Connection,
  ) {}

  async create(
    project_id: number,
    projectPlanningPriceDto: ProjectPlanningPriceDto,
    user_id: number,
  ) {
    try {
      const price = await this.findOne(project_id);
      if (!price) {
        const data = this.projectPriceRepository.create({
          project_id,
          ...projectPlanningPriceDto,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
        await this.projectPriceRepository.save(data);
        return data;
      } else {
        const data = await this.update(
          project_id,
          price.id,
          projectPlanningPriceDto,
          user_id,
        );
        return data;
      }
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findOne(project_id: number) {
    const data = await this.projectPriceRepository.findOne({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      order: { id: 'ASC' },
    });

    return data;
  }
  async update(
    project_id: number,
    price_id: number,
    projectPlanningPriceDto: ProjectPlanningPriceDto,
    user_id: number,
  ) {
    const data = await this.projectPriceRepository.update(
      { project_id, id: price_id },
      {
        ...projectPlanningPriceDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
  async remove(project_id: number, price_id: number) {
    const data = await this.projectPriceRepository.delete({
      project_id,
      id: price_id,
    });
    return data;
  }
  async findPricePlanning(project_id) {
    const data = await this.projectPriceRepository.findOne({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      order: { id: 'ASC' },
    });
    return data;
  }
  async findCompare(project_id: number) {
    const costing = await this.projectPriceRepository.findOne({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      order: { id: 'ASC' },
    });

    const planning = await this.projectPriceRepository.findOne({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      order: { id: 'ASC' },
    });

    return { costing, planning };
  }
}
