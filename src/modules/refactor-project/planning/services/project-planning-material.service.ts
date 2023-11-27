import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, In, IsNull, Repository } from 'typeorm';
import {
  CreateProjectMaterialOtherDto,
  CreateProjectMaterialSourceDto,
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
} from '../dto/project-planning-material.dto';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';

@Injectable()
export class ProjectPlanningMaterialService {
  constructor(
    @InjectRepository(ProjectDetailEntity)
    private projectDetailRepository: Repository<ProjectDetailEntity>,

    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,

    private connection: Connection,
  ) {}

  async createMaterialSource(
    project_detail_id: number,
    createProjectMaterialSourceDto: CreateProjectMaterialSourceDto,
    user_id,
  ) {
    const data = await this.projectDetailRepository.update(
      { id: project_detail_id },
      {
        material_source: createProjectMaterialSourceDto.material_source,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }

  async createMaterialItemOne(
    project_detail_id,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.insert(
        ProjectMaterialItemEntity,
        { ...projectMaterialItemDto, project_detail_id },
      );
      const variant = await queryRunner.manager.find(ProjectVariantEntity, {
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
      if (variant.length > 0) {
        for (const dataVariant of variant) {
          await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
            project_variant_id: dataVariant.id,
            project_material_item_id: projectMaterial.raw[0].id,
            project_detail_id,
          });
        }
      }
      await queryRunner.commitTransaction();

      return { id: projectMaterial.raw[0].id, ...projectMaterialItemDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async listMaterialItem(
    project_detail_id,
    getListProjectMaterialDto: GetListProjectMaterialDto,
    user_id,
  ) {
    const data = await this.projectMaterialItemRepository.find({
      select: {
        id: true,
        project_detail_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        consumption: true,
        consumption_unit: true,
        heavy: true,
        heavy_unit: true,
        long: true,
        long_unit: true,
        wide: true,
        wide_unit: true,
        diameter: true,
        diameter_unit: true,
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        project_detail_id,
        type: getListProjectMaterialDto.type
          ? getListProjectMaterialDto.type
          : In(['Fabric', 'Sewing', 'Packaging']),
      },
      order: {
        type: 'ASC',
        id: 'ASC',
      },
    });
    return data;
  }

  async updateMaterialItemOne(
    project_detail_id: number,
    material_item_id: number,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectMaterialItemRepository.update(
        {
          project_detail_id,
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

  async removeMaterialItemOne(
    project_detail_id: number,
    material_item_id: number,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        ProjectMaterialItemEntity,
        {
          id: material_item_id,
          project_detail_id,
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      await queryRunner.manager.delete(ProjectVendorMaterialEntity, {
        project_material_item_id: material_item_id,
        project_detail_id,
      });
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async createMaterialOther(
    project_detail_id: number,
    createProjectMaterialOtherDto: CreateProjectMaterialOtherDto,
    user_id,
  ) {
    const data = await this.projectDetailRepository.update(
      { id: project_detail_id },
      {
        ...createProjectMaterialOtherDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
    return data;
  }
}
