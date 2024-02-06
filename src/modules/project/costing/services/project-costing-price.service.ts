import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository, In } from 'typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectCostingPriceDto } from '../dto/project-costing-price.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingPriceService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,
    private connection: Connection,
  ) {}

  async create(
    project_id: number,
    projectCostingPriceDto: ProjectCostingPriceDto,
    user_id: number,
  ) {
    try {
      const price = await this.findOne(project_id);
      if (!price) {
        const data = this.projectPriceRepository.create({
          project_id,
          ...projectCostingPriceDto,
          added_in_section: StatusProjectEnum.Costing,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
        await this.projectPriceRepository.save(data);
        return data;
      } else {
        const data = await this.update(
          project_id,
          price.id,
          projectCostingPriceDto,
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
        added_in_section: In([StatusProjectEnum.Costing]),
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
    projectCostingPriceDto: ProjectCostingPriceDto,
    user_id: number,
  ) {
    const data = await this.projectPriceRepository.update(
      { project_id, id: price_id },
      {
        ...projectCostingPriceDto,
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
  async findPriceCosting(project_id) {
    const data = await this.projectPriceRepository.findOne({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      order: { id: 'ASC' },
    });
    return data;
  }
}
