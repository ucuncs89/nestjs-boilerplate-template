import { Injectable } from '@nestjs/common';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceAdditionalEntity } from 'src/entities/project/project_price_additional.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProjectPlanningPriceAdditionalDto,
  ProjectPlanningPriceDto,
} from '../dto/project-planning-price.dto';

@Injectable()
export class ProjectPlanningPriceService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,

    @InjectRepository(ProjectPriceAdditionalEntity)
    private projectPriceAdditionalRepository: Repository<ProjectPriceAdditionalEntity>,
    private connection: Connection,
  ) {}

  async createProjectPrice(
    project_detail_id,
    projectPlanningPriceDto: ProjectPlanningPriceDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const price = await queryRunner.manager.insert(ProjectPriceEntity, {
        project_detail_id,
        loss_percentage: projectPlanningPriceDto.loss_percentage,
        selling_price_per_item: projectPlanningPriceDto.selling_price_per_item,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await queryRunner.commitTransaction();
      return { id: price.raw[0].id, ...projectPlanningPriceDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findProjectPrice(project_detail_id: number) {
    const data = await this.projectPriceRepository.findOne({
      where: { project_detail_id },
      select: {
        id: true,
        project_detail_id: true,
        selling_price_per_item: true,
        loss_percentage: true,
        additional_price: {
          id: true,
          project_price_id: true,
          additional_name: true,
          additional_price: true,
          description: true,
        },
      },
      relations: {
        additional_price: true,
      },
      order: {
        id: 'DESC',
        additional_price: { id: 'ASC' },
      },
    });
    return data;
  }
  async updatePrice(
    project_detail_id: number,
    price_id: number,
    projectPlanningPriceDto: ProjectPlanningPriceDto,
    user_id,
  ) {
    try {
      await this.projectPriceRepository.update(
        {
          id: price_id,
          project_detail_id,
        },
        {
          selling_price_per_item:
            projectPlanningPriceDto.selling_price_per_item,
          loss_percentage: projectPlanningPriceDto.loss_percentage,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );

      return { id: price_id, ...projectPlanningPriceDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async createPriceAdditional(
    price_id,
    projectPlanningPriceAdditionalDto: ProjectPlanningPriceAdditionalDto,
    user_id,
  ) {
    try {
      const data = this.projectPriceAdditionalRepository.create({
        ...projectPlanningPriceAdditionalDto,
        project_price_id: price_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectPriceAdditionalRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updatePriceAdditional(
    price_id: number,
    additional_price_id: number,
    projectPlanningPriceAdditionalDto: ProjectPlanningPriceAdditionalDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectPriceAdditionalRepository.update(
        {
          id: additional_price_id,
          project_price_id: price_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          additional_name: projectPlanningPriceAdditionalDto.additional_name,
          additional_price: projectPlanningPriceAdditionalDto.additional_price,
          description: projectPlanningPriceAdditionalDto.description,
        },
      );
      return data;
    } catch (error) {}
  }
  async findDetailPriceAdditional(additional_price_id: number) {
    const data = await this.projectPriceAdditionalRepository.find({
      where: {
        id: additional_price_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async deletePriceAdditional(additional_price_id: number) {
    return await this.projectPriceAdditionalRepository.delete({
      id: additional_price_id,
    });
  }
}
