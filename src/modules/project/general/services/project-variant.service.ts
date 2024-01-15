import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Connection, IsNull, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVariantDto } from '../dto/project-variant.dto';
import { ProjectVariantSizeEntity } from 'src/entities/project/project_variant_size.entity';

@Injectable()
export class ProjectVariantService {
  constructor(
    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,
    private connection: Connection,
  ) {}

  async creteOneVariant(
    project_id: number,
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
          project_id,
          name: projectVariantDto.name,
          total_item: projectVariantDto.total_item,
          item_unit: projectVariantDto.item_unit,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );

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
      // const material = await queryRunner.manager.find(
      //   ProjectMaterialItemEntity,
      //   {
      //     where: {
      //       project_detail_id,
      //       deleted_at: IsNull(),
      //       deleted_by: IsNull(),
      //     },
      //   },
      // );
      // if (material.length > 0) {
      //   for (const dataMaterial of material) {
      //     await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
      //       project_variant_id: projectVariant.raw[0].id,
      //       project_material_item_id: dataMaterial.id,
      //       project_detail_id,
      //     });
      //   }
      // }
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

  async findVariant(project_id: number) {
    const data = await this.projectVariantRepository.find({
      where: { project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_id: true,
        name: true,
        total_item: true,
        item_unit: true,
      },
      relations: {
        project_variant_size: true,
      },
    });
    return data;
  }

  async findOneVariant(project_id: number, variant_id: number) {
    const data = await this.projectVariantRepository.findOne({
      where: {
        id: variant_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_id: true,
        name: true,
        total_item: true,
        item_unit: true,
      },
      relations: {
        project_variant_size: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async removeVariantById(
    project_id: number,
    variant_id: number,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(ProjectVariantSizeEntity, {
        project_variant_id: variant_id,
      });
      await queryRunner.manager.update(
        ProjectVariantEntity,
        {
          id: variant_id,
          project_id,
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      // await queryRunner.manager.delete(ProjectVendorMaterialEntity, {
      //   project_variant_id: variant_id,
      //   project_detail_id,
      // });
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
    project_id: number,
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
          name: projectVariantDto.name,
          total_item: projectVariantDto.total_item,
          item_unit: projectVariantDto.item_unit,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );

      await queryRunner.manager.delete(ProjectVariantSizeEntity, {
        project_variant_id: variant_id,
      });

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
