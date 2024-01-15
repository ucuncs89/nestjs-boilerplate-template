import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { Connection, In, IsNull, Repository } from 'typeorm';
import {
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
} from '../dto/project-costing-material.dto';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,
    private connection: Connection,
  ) {}
  async findAllMaterialItem(
    project_id,
    getListProjectMaterialDto: GetListProjectMaterialDto,
  ) {
    const data = await this.projectMaterialItemRepository.find({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        section_type: true,
        avg_price: true,
        total_price: true,
        created_at: true,
        vendor_material: {
          id: true,
          project_id: true,
          project_variant_id: true,
          project_material_item_id: true,
          section_type: true,
          total_item: true,
          total_consumption: true,
          project_variant: {
            id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            vendor_id: true,
            type: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            total_price: true,
            vendors: { id: true, company_name: true },
          },
        },
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        project_id,
        section_type: StatusProjectEnum.Costing,
        type:
          getListProjectMaterialDto.type != null
            ? getListProjectMaterialDto.type
            : In(['Fabric', 'Sewing', 'Packaging', 'Finished goods']),
        vendor_material: { section_type: StatusProjectEnum.Costing },
      },
      relations: {
        vendor_material: { project_variant: true, detail: { vendors: true } },
      },
      order: {
        type: 'ASC',
        id: 'ASC',
      },
    });
    return data;
  }
  async createMaterialItemOne(
    project_id,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.insert(
        ProjectMaterialItemEntity,
        {
          ...projectMaterialItemDto,
          project_id,
          section_type: StatusProjectEnum.Costing,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      const variant = await queryRunner.manager.find(ProjectVariantEntity, {
        where: {
          project_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
      if (variant.length > 0) {
        for (const dataVariant of variant) {
          await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
            project_variant_id: dataVariant.id,
            project_material_item_id: projectMaterial.raw[0].id,
            project_id,
            section_type: StatusProjectEnum.Costing,
          });
        }
      }
      await queryRunner.commitTransaction();

      return { ...projectMaterialItemDto, id: projectMaterial.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findOneMaterialItem(
    project_id: number,
    project_material_item_id: number,
  ) {
    const data = await this.projectMaterialItemRepository.find({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        section_type: true,
        avg_price: true,
        total_price: true,
        created_at: true,
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        project_id,
        id: project_material_item_id,
      },
    });
    return data;
  }

  async updateMaterialItemOne(
    project_id: number,
    material_item_id: number,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectMaterialItemRepository.update(
        {
          project_id,
          id: material_item_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectMaterialItemDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteMaterialItemOne(
    project_id: number,
    material_item_id: number,
    user_id: number,
  ) {
    try {
      const data = await this.projectMaterialItemRepository.update(
        {
          project_id,
          id: material_item_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
