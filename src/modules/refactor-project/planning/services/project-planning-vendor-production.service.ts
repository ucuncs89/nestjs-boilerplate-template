import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';

import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectService } from '../../general/services/project.service';
import {
  ProjectPlanningVendorProductionDetailDto,
  ProjectPlanningVendorProductionDto,
  ProjectPlanningVendorProductionLossPercentageDto,
} from '../dto/project-planning-vendor-production.dto';

@Injectable()
export class ProjectPlanningVendorProductionService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,
    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,
    private connection: Connection,
  ) {}

  async findVendorProduction(project_detail_id) {
    const data = await this.projectVendorProductionRepository.find({
      select: {
        id: true,
        project_detail_id: true,
        activity_id: true,
        activity_name: true,
        percentage_of_loss: true,
        total_quantity: true,
        sub_total_price: true,
        quantity_unit_required: true,
        vendor_production_detail: {
          id: true,
          price: true,
          quantity: true,
          quantity_unit: true,
          vendor_id: true,
          vendor_name: true,
          project_vendor_production_id: true,
        },
      },
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: {
        vendor_production_detail: true,
      },
      order: {
        id: 'DESC',
      },
    });
    return data;
  }

  async createVendorProductionActivity(
    project_detail_id,
    projectPlanningVendorProductionDto: ProjectPlanningVendorProductionDto,
    user_id,
    i18n,
  ) {
    try {
      const activity = this.projectVendorProductionRepository.create({
        ...projectPlanningVendorProductionDto,
        project_detail_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionRepository.save(activity);
      return activity;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async removeVendorProductionActivity(
    project_detail_id: number,
    id: number,
    user_id,
  ) {
    try {
      const data = await this.projectVendorProductionRepository.delete({
        id,
        project_detail_id,
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorProduction(
    project_detail_id,
    project_vendor_production_id: number,
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const vendor = this.projectVendorProductionDetailRepository.create({
        ...projectPlanningVendorProductionDetailDto,
        project_vendor_production_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionDetailRepository.save(vendor);
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return vendor;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateVendorProduction(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
          project_vendor_production_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectPlanningVendorProductionDetailDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteVendorProductionDetail(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.delete({
        project_vendor_production_id,
        id: project_vendor_production_detail_id,
      });
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateLossPercentage(
    project_detail_id,
    projectPlanningVendorProductionLossPercentageDto: ProjectPlanningVendorProductionLossPercentageDto[],
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        Array.isArray(projectPlanningVendorProductionLossPercentageDto) &&
        projectPlanningVendorProductionLossPercentageDto.length > 0
      ) {
        for (const data of projectPlanningVendorProductionLossPercentageDto) {
          await queryRunner.manager.update(
            ProjectVendorProductionEntity,
            {
              id: data.id,
              project_detail_id,
            },
            {
              percentage_of_loss: data.percentage_of_loss,
              updated_at: new Date().toISOString(),
            },
          );
        }
        await queryRunner.commitTransaction();
      }
      return projectPlanningVendorProductionLossPercentageDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findVendorProductionDetailReview(project_detail_id) {
    const projectVendor = await this.findIdsVendorProduction(project_detail_id);
    if (projectVendor.length < 1) {
      return [];
    }
    const arrId = projectVendor.map((item) => item.id);
    const data = await this.projectVendorProductionDetailRepository.find({
      where: { project_vendor_production_id: In(arrId) },
      select: {
        id: true,
        project_vendor_production_id: true,
        vendor_id: true,
        vendor_name: true,
        price: true,
        quantity: true,
        quantity_unit: true,
        vendor_production: {
          id: true,
          project_detail_id: true,
          activity_id: true,
          activity_name: true,
          percentage_of_loss: true,
          total_quantity: true,
          quantity_unit_required: true,
          sub_total_price: true,
        },
      },
      relations: { vendor_production: true },
    });
    return data;
  }

  async findIdsVendorProduction(project_detail_id) {
    const data = await this.projectVendorProductionRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        activity_id: true,
        activity_name: true,
        percentage_of_loss: true,
      },
    });
    return data;
  }

  async updateTotalQuantitySubtotal(project_vendor_production_id) {
    const total_quantity =
      await this.projectVendorProductionDetailRepository.sum('quantity', {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      });
    const sumPrice = await this.projectVendorProductionDetailRepository.sum(
      'price',
      {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    );
    const update = await this.projectVendorProductionRepository.update(
      {
        id: project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      {
        total_quantity,
        sub_total_price: sumPrice,
      },
    );
    return update;
  }
}
