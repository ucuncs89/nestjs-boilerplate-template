import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { IsNull, Repository } from 'typeorm';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceAdditionalEntity } from 'src/entities/project/project_price_additional.entity';
import { ProjectProductionPriceCostDto } from '../dto/project-production-price.dto';

@Injectable()
export class ProjectProductionPriceService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,

    @InjectRepository(ProjectPriceAdditionalEntity)
    private projectPriceAdditionalRepository: Repository<ProjectPriceAdditionalEntity>,
  ) {}
  async createProjectAdd(
    project_price_id: number,
    projectProductionPriceCostDto: ProjectProductionPriceCostDto,
    user_id,
  ) {
    try {
      const price = this.projectPriceAdditionalRepository.create({
        ...projectProductionPriceCostDto,
        project_price_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectPriceAdditionalRepository.save(price);
      return price;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findAndGeneratePriceId(project_detail_id, user_id) {
    const price = await this.projectPriceRepository.findOne({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!price) {
      const insert = this.projectPriceRepository.create({
        project_detail_id,
        created_by: user_id,
        created_at: new Date().toISOString(),
        loss_percentage: 0,
        selling_price_per_item: 0,
      });
      await this.projectPriceRepository.save(insert);
      return insert;
    }
    return price;
  }
  async updatePriceAdditional(
    additional_price_id: number,
    projectProductionPriceCostDto: ProjectProductionPriceCostDto,
    user_id: number,
  ) {
    try {
      await this.projectPriceAdditionalRepository.update(
        {
          id: additional_price_id,
        },
        {
          additional_name: projectProductionPriceCostDto.additional_name,
          additional_price: projectProductionPriceCostDto.additional_price,
          description: projectProductionPriceCostDto.description,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: additional_price_id, ...projectProductionPriceCostDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailPriceAdditional(additional_price_id: number) {
    const data = await this.projectPriceAdditionalRepository.findOne({
      where: {
        id: additional_price_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deletePriceAdditional(additional_price_id: number) {
    return await this.projectPriceAdditionalRepository.delete({
      id: additional_price_id,
    });
  }
  async findByPriceId(price_id: number) {
    const price = await this.projectPriceAdditionalRepository.find({
      where: {
        project_price_id: price_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return price;
  }
}
