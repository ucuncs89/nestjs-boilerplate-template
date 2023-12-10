import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import {
  ProjectProductionShippingDto,
  ProjectProductionShippingPackingDto,
} from '../dto/project-production-shipping.dto';
import { ProjectShippingPackingEntity } from 'src/entities/project/project_shipping_packing.entity';
import { ProjectShippingPackingDetailEntity } from 'src/entities/project/project_shipping_packing_detail.entity';

@Injectable()
export class ProjectProductionShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    @InjectRepository(ProjectShippingPackingEntity)
    private projectShippingPackingRepository: Repository<ProjectShippingPackingEntity>,

    private connection: Connection,
  ) {}
  async createShipping(
    project_detail_id,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectProductionShippingDto,
        project_detail_id,
        created_at: new Date().toISOString(),
      });
      await this.projectShippingRepository.save(shipping);
      return shipping;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateShipping(
    shipping_id: number,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          shipping_cost: projectProductionShippingDto.shipping_cost,
          shipping_date: projectProductionShippingDto.shipping_date,
          shipping_name: projectProductionShippingDto.shipping_name,
          shipping_vendor_name:
            projectProductionShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: shipping_id, ...projectProductionShippingDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailShipping(shipping_id: number) {
    const data = await this.projectShippingRepository.findOne({
      where: {
        id: shipping_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: {
        packing: { detail: true },
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deleteShipping(shipping_id) {
    return await this.projectShippingRepository.delete({ id: shipping_id });
  }
  async findByProjectDetailId(project_detail_id) {
    const shipping = await this.projectShippingRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return shipping;
  }
  async createShippingPacking(
    shipping_id: number,
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const packing = await queryRunner.manager.insert(
        ProjectShippingPackingEntity,
        {
          project_shipping_id: shipping_id,
          variant_id: projectProductionShippingPackingDto.variant_id,
          variant_name: projectProductionShippingPackingDto.variant_name,
          created_at: new Date().toISOString(),
          created_by: user_id,
          total_item: projectProductionShippingPackingDto.total_item,
        },
      );
      if (projectProductionShippingPackingDto.detail) {
        for (const detail of projectProductionShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectProductionShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();

      return { id: packing.raw[0].id, ...projectProductionShippingPackingDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async updateShippingPacking(
    packing_id: number,
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        ProjectShippingPackingEntity,
        packing_id,
        {
          variant_id: projectProductionShippingPackingDto.variant_id,
          variant_name: projectProductionShippingPackingDto.variant_name,
          total_item: projectProductionShippingPackingDto.total_item,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );

      await queryRunner.manager.delete(ProjectShippingPackingDetailEntity, {
        project_shipping_packing_id: packing_id,
      });
      if (projectProductionShippingPackingDto.detail) {
        for (const detail of projectProductionShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing_id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectProductionShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();
      return { id: packing_id, ...projectProductionShippingPackingDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findOnePacking(shipping_id: number, packing_id: number) {
    const data = await this.projectShippingPackingRepository.findOne({
      where: {
        id: packing_id,
        project_shipping_id: shipping_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        variant_id: true,
        variant_name: true,
        total_item: true,
        project_shipping_id: true,
        detail: { id: true, number_of_item: true, size_ratio: true },
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deletePacking(shipping_id: number, packing_id: number) {
    const data = await this.projectShippingPackingRepository.delete({
      id: packing_id,
      project_shipping_id: shipping_id,
      deleted_at: IsNull(),
      deleted_by: IsNull(),
    });
    return data;
  }

  async findShippingPacking(project_detail_id) {
    const data = await this.projectShippingRepository.find({
      select: {
        id: true,
        project_detail_id: true,
        shipping_cost: true,
        shipping_date: true,
        shipping_name: true,
        shipping_vendor_name: true,
        packing: {
          id: true,
          project_shipping_id: true,
          total_item: true,
          variant_id: true,
          variant_name: true,
          detail: {
            id: true,
            project_shipping_packing_id: true,
            number_of_item: true,
            size_ratio: true,
          },
        },
      },
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      relations: { packing: { detail: true } },
    });
    return data;
  }
}
