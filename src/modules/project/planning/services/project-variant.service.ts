import { Injectable } from '@nestjs/common';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectVariantDto } from '../dto/project-variant.dto';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVariantFabricColorEntity } from 'src/entities/project/project_variant_fabric_color.entity';
import { ProjectVariantSizeEntity } from 'src/entities/project/project_variant_size.entity';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';

@Injectable()
export class ProjectVariantService {
  constructor(
    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,

    @InjectRepository(ProjectMaterialEntity)
    private projectMaterialRepository: Repository<ProjectMaterialEntity>,

    @InjectRepository(ProjectFabricEntity)
    private projectFabricRepository: Repository<ProjectFabricEntity>,

    @InjectRepository(ProjectAccessoriesSewingEntity)
    private projectAccessoriesSewingRepository: Repository<ProjectAccessoriesSewingEntity>,

    @InjectRepository(ProjectAccessoriesPackagingEntity)
    private projectAccessoriesPackagingRepository: Repository<ProjectAccessoriesPackagingEntity>,

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
    const material = await this.findIdsMaterialFabricSewingPackaging(
      project_detail_id,
    );

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

        //fabric
        if (Array.isArray(material.fabric) && material.fabric.length > 0) {
          for (const fabric of material.fabric) {
            await queryRunner.manager.insert(
              ProjectVendorMaterialFabricEntity,
              {
                project_variant_id: projectVariant.raw[0].id,
                project_fabric_id: fabric.id,
                project_detail_id,
              },
            );
          }
        }

        //sewing
        if (Array.isArray(material.sewing) && material.sewing.length > 0) {
          for (const sewing of material.sewing) {
            await queryRunner.manager.insert(
              ProjectVendorMaterialAccessoriesSewingEntity,
              {
                project_variant_id: projectVariant.raw[0].id,
                project_accessories_sewing_id: sewing.id,
                project_detail_id,
              },
            );
          }
        }

        //packaging
        if (
          Array.isArray(material.packaging) &&
          material.packaging.length > 0
        ) {
          for (const packaging of material.packaging) {
            await queryRunner.manager.insert(
              ProjectVendorMaterialAccessoriesPackagingEntity,
              {
                project_variant_id: projectVariant.raw[0].id,
                project_accessories_packaging_id: packaging.id,
                project_detail_id,
              },
            );
          }
        }
        if (material.material_source === 'Finished goods') {
          await queryRunner.manager.insert(
            ProjectVendorMaterialFinishedGoodEntity,
            {
              project_variant_id: projectVariant.raw[0].id,
              project_detail_id,
            },
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

  async updateProjectVariantTransaction(
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
    const material = await this.findIdsMaterialFabricSewingPackaging(
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
      for (const variant of createProjectVariantDto.variant) {
        if (variant.method_type === 'new') {
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
          //fabric
          if (Array.isArray(material.fabric) && material.fabric.length > 0) {
            for (const fabric of material.fabric) {
              await queryRunner.manager.insert(
                ProjectVendorMaterialFabricEntity,
                {
                  project_variant_id: projectVariant.raw[0].id,
                  project_fabric_id: fabric.id,
                  project_detail_id,
                },
              );
            }
          }

          //sewing
          if (Array.isArray(material.sewing) && material.sewing.length > 0) {
            for (const sewing of material.sewing) {
              await queryRunner.manager.insert(
                ProjectVendorMaterialAccessoriesSewingEntity,
                {
                  project_variant_id: projectVariant.raw[0].id,
                  project_accessories_sewing_id: sewing.id,
                  project_detail_id,
                },
              );
            }
          }

          //packaging
          if (
            Array.isArray(material.packaging) &&
            material.packaging.length > 0
          ) {
            for (const packaging of material.packaging) {
              await queryRunner.manager.insert(
                ProjectVendorMaterialAccessoriesPackagingEntity,
                {
                  project_variant_id: projectVariant.raw[0].id,
                  project_accessories_packaging_id: packaging.id,
                  project_detail_id,
                },
              );
            }
          }
          //finished goods
          if (material.material_source === 'Finished goods') {
            await queryRunner.manager.insert(
              ProjectVendorMaterialFinishedGoodEntity,
              {
                project_variant_id: projectVariant.raw[0].id,
                project_detail_id,
              },
            );
          }

          arrResult.push({ id: projectVariant.raw[0].id, ...variant });
        } else if (variant.method_type === 'edit') {
          delete variant.method_type;
          variant.project_detail_id = project_detail_id;
          await queryRunner.manager.update(
            ProjectVariantEntity,
            { id: variant.id },
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
              fabric.project_variant_id = variant.id;
            }
            await queryRunner.manager.insert(
              ProjectVariantFabricColorEntity,
              variant.project_fabric,
            );
          }
          if (Array.isArray(variant.size) && variant.size.length > 0) {
            for (const size of variant.size) {
              size.project_variant_id = variant.id;
            }
            await queryRunner.manager.insert(
              ProjectVariantSizeEntity,
              variant.size,
            );
          }
          arrResult.push({ id: variant.id, ...variant });
        } else if (variant.method_type === 'delete') {
          await queryRunner.manager.delete(ProjectVariantEntity, {
            id: variant.id,
          });
          await queryRunner.manager.delete(ProjectVendorMaterialFabricEntity, {
            project_variant_id: variant.id,
            project_detail_id,
          });
          await queryRunner.manager.delete(
            ProjectVendorMaterialAccessoriesSewingEntity,
            {
              project_variant_id: variant.id,
              project_detail_id,
            },
          );
          await queryRunner.manager.delete(
            ProjectVendorMaterialAccessoriesPackagingEntity,
            {
              project_variant_id: variant.id,
              project_detail_id,
            },
          );
          await queryRunner.manager.delete(
            ProjectVendorMaterialFinishedGoodEntity,
            {
              project_variant_id: variant.id,
              project_detail_id,
            },
          );
        }
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

  async findIdsMaterialFabricSewingPackaging(project_detail_id) {
    const materialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
        material_source: true,
      },
      order: {
        id: 'DESC',
      },
    });

    if (!materialId) {
      return {
        fabric: null,
        sewing: null,
        packaging: null,
        material_source: null,
      };
    }
    const fabric = await this.projectFabricRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });

    const sewing = await this.projectAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });

    const packaging = await this.projectAccessoriesPackagingRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return {
      fabric,
      sewing,
      packaging,
      material_source: materialId.material_source,
    };
  }
}
