import { Injectable } from '@nestjs/common';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectVariantDto } from '../dto/project-variant.dto';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVariantFabricColorEntity } from 'src/entities/project/project_variant_fabric_color.entity';
import { ProjectVariantSizeEntity } from 'src/entities/project/project_variant_size.entity';

@Injectable()
export class ProjectVariantService {
  constructor(
    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,
    private connection: Connection,
  ) {}

  async createProjectVariant(
    project_id: number,
    project_detail_id: number,
    createProjectVariantDto: CreateProjectVariantDto,
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const variant of createProjectVariantDto.variant) {
        const projectVariant = await queryRunner.manager.insert(
          ProjectVariantEntity,
          {
            project_detail_id,
            name: variant.name,
            total_item: variant.total_item,
            item_unit: variant.item_unit,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(variant.project_fabric) &&
          variant.project_fabric.length > 0
        ) {
          for (const fabric of variant.project_fabric) {
            fabric.project_variant_id = projectVariant.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVariantFabricColorEntity,
            variant.project_fabric,
          );
        }
        if (Array.isArray(variant.size) && variant.size.length > 0) {
          for (const size of variant.size) {
            size.project_variant_id = projectVariant.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVariantSizeEntity,
            variant.size,
          );
        }
        arrResult.push({ id: projectVariant.raw[0].id, ...variant });
      }
      await queryRunner.commitTransaction();
      return arrResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findByProjectDetail(project_id: number, project_detail_id: number) {
    return await this.projectVariantRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_detail_id: true,
        name: true,
        total_item: true,
        item_unit: true,
      },
      relations: {
        size: true,
        project_fabric: true,
      },
    });
  }

  async updateProjectVariant(
    project_id: number,
    project_detail_id: number,
    createProjectVariantDto: CreateProjectVariantDto,
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const arrVariantId = await this.findVariantIdsByProjectDetailId(
      project_detail_id,
    );
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(ProjectVariantFabricColorEntity, {
        project_variant_id: In(arrVariantId),
      });
      await queryRunner.manager.delete(ProjectVariantSizeEntity, {
        project_variant_id: In(arrVariantId),
      });
      await queryRunner.manager.delete(ProjectVariantEntity, {
        project_detail_id,
      });
      for (const variant of createProjectVariantDto.variant) {
        const projectVariant = await queryRunner.manager.insert(
          ProjectVariantEntity,
          {
            project_detail_id,
            name: variant.name,
            total_item: variant.total_item,
            item_unit: variant.item_unit,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(variant.project_fabric) &&
          variant.project_fabric.length > 0
        ) {
          for (const fabric of variant.project_fabric) {
            fabric.project_variant_id = projectVariant.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVariantFabricColorEntity,
            variant.project_fabric,
          );
        }
        if (Array.isArray(variant.size) && variant.size.length > 0) {
          for (const size of variant.size) {
            size.project_variant_id = projectVariant.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVariantSizeEntity,
            variant.size,
          );
        }
        arrResult.push({ id: projectVariant.raw[0].id, ...variant });
      }
      await queryRunner.commitTransaction();
      return arrResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findVariantIdsByProjectDetailId(project_detail_id: number) {
    const data = await this.projectVariantRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: { id: true },
    });
    return data.map((v) => v.id);
  }
}
