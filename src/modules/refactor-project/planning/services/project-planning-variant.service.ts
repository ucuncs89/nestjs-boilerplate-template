import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVariantFabricColorEntity } from 'src/entities/project/project_variant_fabric_color.entity';
import { ProjectVariantSizeEntity } from 'src/entities/project/project_variant_size.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectVariantDto } from '../dto/project-planning-variant.dto';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';

@Injectable()
export class ProjectPlanningVariantService {
  constructor(
    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,

    private connection: Connection,
  ) {}

  async findVariant(project_detail_id: number) {
    const data = await this.projectVariantRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_detail_id: true,
        name: true,
        total_item: true,
        item_unit: true,
        project_fabric: {
          id: true,
          project_variant_id: true,
          color_id: true,
          project_fabric_id: true,
          project_material_item: {
            id: true,
            name: true,
            consumption: true,
            consumption_unit: true,
            type: true,
            category: true,
          },
        },
      },
      relations: {
        size: true,
        project_fabric: { project_material_item: true },
      },
    });
    return data;
  }
  async findOneVarinat(project_detail_id: number, variant_id: number) {
    const data = await this.projectVariantRepository.findOne({
      where: {
        id: variant_id,
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_detail_id: true,
        name: true,
        total_item: true,
        item_unit: true,
        project_fabric: {
          id: true,
          project_variant_id: true,
          color_id: true,
          project_fabric_id: true,
          color_name: true,
          project_material_item: {
            id: true,
            name: true,
            consumption: true,
            consumption_unit: true,
            type: true,
            category: true,
          },
        },
      },
      relations: {
        size: true,
        project_fabric: { project_material_item: true },
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async creteOneVariant(
    project_detail_id: number,
    projectVariantDto: ProjectVariantDto,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectVariant = await queryRunner.manager.insert(
        ProjectVariantEntity,
        {
          project_detail_id,
          name: projectVariantDto.name,
          total_item: projectVariantDto.total_item,
          item_unit: projectVariantDto.item_unit,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      if (
        Array.isArray(projectVariantDto.project_fabric) &&
        projectVariantDto.project_fabric.length > 0
      ) {
        for (const fabric of projectVariantDto.project_fabric) {
          fabric.project_variant_id = projectVariant.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectVariantFabricColorEntity,
          projectVariantDto.project_fabric,
        );
      }
      if (
        Array.isArray(projectVariantDto.size) &&
        projectVariantDto.size.length > 0
      ) {
        for (const size of projectVariantDto.size) {
          size.project_variant_id = projectVariant.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectVariantSizeEntity,
          projectVariantDto.size,
        );
      }
      const material = await queryRunner.manager.find(
        ProjectMaterialItemEntity,
        {
          where: {
            project_detail_id,
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        },
      );
      if (material.length > 0) {
        for (const dataMaterial of material) {
          await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
            project_variant_id: projectVariant.raw[0].id,
            project_material_item_id: dataMaterial.id,
            project_detail_id,
          });
        }
      }
      //nanti tambahin relasi ke project_vendor_material
      await queryRunner.commitTransaction();

      return { ...projectVariantDto, id: projectVariant.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async removeVariantById(
    project_detail_id: number,
    variant_id: number,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(ProjectVariantFabricColorEntity, {
        project_variant_id: variant_id,
      });
      await queryRunner.manager.delete(ProjectVariantSizeEntity, {
        project_variant_id: variant_id,
      });
      await queryRunner.manager.update(
        ProjectVariantEntity,
        {
          id: variant_id,
          project_detail_id,
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      await queryRunner.manager.delete(ProjectVendorMaterialEntity, {
        project_variant_id: variant_id,
        project_detail_id,
      });
      //nanti disini tambahin project_vendor_material_item gitu
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOneVariant(
    project_detail_id: number,
    variant_id: number,
    projectVariantDto: ProjectVariantDto,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        ProjectVariantEntity,
        { id: variant_id },
        {
          project_detail_id,
          name: projectVariantDto.name,
          total_item: projectVariantDto.total_item,
          item_unit: projectVariantDto.item_unit,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      await queryRunner.manager.delete(ProjectVariantFabricColorEntity, {
        project_variant_id: variant_id,
      });
      await queryRunner.manager.delete(ProjectVariantSizeEntity, {
        project_variant_id: variant_id,
      });
      if (
        Array.isArray(projectVariantDto.project_fabric) &&
        projectVariantDto.project_fabric.length > 0
      ) {
        for (const fabric of projectVariantDto.project_fabric) {
          fabric.project_variant_id = variant_id;
        }
        await queryRunner.manager.insert(
          ProjectVariantFabricColorEntity,
          projectVariantDto.project_fabric,
        );
      }
      if (
        Array.isArray(projectVariantDto.size) &&
        projectVariantDto.size.length > 0
      ) {
        for (const size of projectVariantDto.size) {
          size.project_variant_id = variant_id;
        }
        await queryRunner.manager.insert(
          ProjectVariantSizeEntity,
          projectVariantDto.size,
        );
      }
      await queryRunner.commitTransaction();
      return { id: variant_id, ...projectVariantDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
