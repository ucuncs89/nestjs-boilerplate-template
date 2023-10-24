import { Injectable } from '@nestjs/common';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateProjectMaterialDto } from '../dto/create-project-material.dto';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProjectMaterialDto } from '../dto/update-project-material.dto';
import { ProjectVariantService } from './project-variant.service';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';

@Injectable()
export class ProjectMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialEntity)
    private projectMaterialRepository: Repository<ProjectMaterialEntity>,

    @InjectRepository(ProjectFabricEntity)
    private projectFabricRepository: Repository<ProjectFabricEntity>,

    @InjectRepository(ProjectAccessoriesSewingEntity)
    private projectAccessoriesSewingRepository: Repository<ProjectAccessoriesSewingEntity>,

    @InjectRepository(ProjectAccessoriesPackagingEntity)
    private projectAccessoriesPackagingRepository: Repository<ProjectAccessoriesPackagingEntity>,

    private projectVariantService: ProjectVariantService,
    private connection: Connection,
  ) {}

  async createDetailMaterial(
    project_id: number,
    project_detail_id: number,
    createProjectMaterialDto: CreateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.insert(
        ProjectMaterialEntity,
        {
          project_detail_id,
          material_source: createProjectMaterialDto.material_source,
          total_price: createProjectMaterialDto.total_price,
          fabric_percentage_of_loss:
            createProjectMaterialDto.fabric_percentage_of_loss
              ? createProjectMaterialDto.fabric_percentage_of_loss
              : 0,
          sewing_accessories_percentage_of_loss:
            createProjectMaterialDto.sewing_accessories_percentage_of_loss
              ? createProjectMaterialDto.sewing_accessories_percentage_of_loss
              : 0,
          packaging_accessories_percentage_of_loss:
            createProjectMaterialDto.packaging_accessories_percentage_of_loss
              ? createProjectMaterialDto.packaging_accessories_percentage_of_loss
              : 0,
          packaging_instructions:
            createProjectMaterialDto.packaging_instructions,
          created_at: new Date().toISOString(),
          created_by: user_id,
          finished_goods_percentage_of_loss:
            createProjectMaterialDto.finished_goods_percentage_of_loss
              ? createProjectMaterialDto.finished_goods_percentage_of_loss
              : 0,
        },
      );
      if (
        Array.isArray(createProjectMaterialDto.fabric) &&
        createProjectMaterialDto.fabric.length > 0
      ) {
        for (const fabric of createProjectMaterialDto.fabric) {
          fabric.project_material_id = projectMaterial.raw[0].id;
        }

        await queryRunner.manager.insert(
          ProjectFabricEntity,
          createProjectMaterialDto.fabric,
        );
      }
      if (
        Array.isArray(createProjectMaterialDto.accessories_sewing) &&
        createProjectMaterialDto.accessories_sewing.length > 0
      ) {
        for (const sewing of createProjectMaterialDto.accessories_sewing) {
          sewing.project_material_id = projectMaterial.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectAccessoriesSewingEntity,
          createProjectMaterialDto.accessories_sewing,
        );
      }
      if (
        Array.isArray(createProjectMaterialDto.accessories_packaging) &&
        createProjectMaterialDto.accessories_packaging.length > 0
      ) {
        for (const sewing of createProjectMaterialDto.accessories_packaging) {
          sewing.project_material_id = projectMaterial.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectAccessoriesPackagingEntity,
          createProjectMaterialDto.accessories_packaging,
        );
      }
      await queryRunner.commitTransaction();
      return { id: projectMaterial.raw[0].id, ...createProjectMaterialDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findByProjectDetail(project_id: number, project_detail_id: number) {
    return await this.projectMaterialRepository.findOne({
      where: { project_detail_id },
      relations: {
        fabric: true,
        accessories_sewing: true,
        accessories_packaging: true,
      },
    });
  }
  async findDetailbyMaterialId(
    project_id: number,
    project_detail_id: number,
    material_id: number,
  ) {
    return await this.projectMaterialRepository.findOne({
      where: { project_detail_id, id: material_id },
      relations: {
        fabric: true,
        accessories_sewing: true,
        accessories_packaging: true,
      },
    });
  }

  async updateDetailMaterial(
    project_id: number,
    project_detail_id: number,
    project_material_id: number,
    updateProjectMaterialDto: UpdateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.update(
        ProjectMaterialEntity,
        project_material_id,
        {
          project_detail_id,
          material_source: updateProjectMaterialDto.material_source,
          total_price: updateProjectMaterialDto.total_price,
          fabric_percentage_of_loss:
            updateProjectMaterialDto.fabric_percentage_of_loss,
          sewing_accessories_percentage_of_loss:
            updateProjectMaterialDto.sewing_accessories_percentage_of_loss,
          packaging_accessories_percentage_of_loss:
            updateProjectMaterialDto.packaging_accessories_percentage_of_loss,
          packaging_instructions:
            updateProjectMaterialDto.packaging_instructions,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      // fabric
      if (
        Array.isArray(updateProjectMaterialDto.fabric) &&
        updateProjectMaterialDto.fabric.length > 0
      ) {
        for (const fabric of updateProjectMaterialDto.fabric) {
          fabric.project_material_id = project_material_id;
        }

        await queryRunner.manager.delete(ProjectFabricEntity, {
          project_material_id,
        });

        await queryRunner.manager.insert(
          ProjectFabricEntity,
          updateProjectMaterialDto.fabric,
        );
      }
      //accessories sewing
      if (
        Array.isArray(updateProjectMaterialDto.accessories_sewing) &&
        updateProjectMaterialDto.accessories_sewing.length > 0
      ) {
        for (const sewing of updateProjectMaterialDto.accessories_sewing) {
          sewing.project_material_id = project_material_id;
        }
        await queryRunner.manager.delete(ProjectAccessoriesSewingEntity, {
          project_material_id,
        });
        await queryRunner.manager.insert(
          ProjectAccessoriesSewingEntity,
          updateProjectMaterialDto.accessories_sewing,
        );
      }
      //accessories packaging
      if (
        Array.isArray(updateProjectMaterialDto.accessories_packaging) &&
        updateProjectMaterialDto.accessories_packaging.length > 0
      ) {
        for (const sewing of updateProjectMaterialDto.accessories_packaging) {
          sewing.project_material_id = project_material_id;
        }
        await queryRunner.manager.delete(ProjectAccessoriesPackagingEntity, {
          project_material_id,
        });
        await queryRunner.manager.insert(
          ProjectAccessoriesPackagingEntity,
          updateProjectMaterialDto.accessories_packaging,
        );
      }
      await queryRunner.commitTransaction();
      return { id: project_material_id, ...updateProjectMaterialDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findProjectFabricVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const fabric = await this.projectFabricRepository.find({
      select: {
        id: true,
        project_material_id: true,
        fabric_id: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        consumption: true,
        consumption_unit: true,
        heavy: true,
        heavy_unit: true,
        wide: true,
        wide_unit: true,
        diameter: true,
        diameter_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of fabric) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }
  async findProjectSewingVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const sewing = await this.projectAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_material_id: true,
        accessories_sewing_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of sewing) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }

  async findProjectPackagingVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const packaging = await this.projectAccessoriesPackagingRepository.find({
      select: {
        id: true,
        project_material_id: true,
        accessories_packaging_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of packaging) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }

  async findProjectConfirmFabric(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      return [];
    }
    const data = await this.projectFabricRepository.find({
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        vendor_material: {
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          project_variant: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
          detail: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
        vendor_material: {
          id: true,
          project_detail_id: true,
          project_variant_id: true,
          project_variant: {
            id: true,
            project_detail_id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            project_vendor_material_fabric_id: true,
            vendor_id: true,
            total_price: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            vendors: {
              id: true,
              company_name: true,
            },
          },
        },
      },
      relations: {
        vendor_material: { detail: { vendors: true }, project_variant: true },
      },
    });
    const arrResult = [];
    for (const item of data) {
      arrResult.push({ ...item, type: 'Fabric' });
    }
    return arrResult;
  }

  async findProjectConfirmSewing(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      return [];
    }
    const data = await this.projectAccessoriesSewingRepository.find({
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        vendor_material: {
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          project_variant: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
          detail: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
        vendor_material: {
          id: true,
          project_detail_id: true,
          project_variant_id: true,
          project_variant: {
            id: true,
            project_detail_id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            project_vendor_material_accessories_sewing_id: true,
            vendor_id: true,
            total_price: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            vendors: {
              id: true,
              company_name: true,
            },
          },
        },
      },
      relations: {
        vendor_material: { detail: { vendors: true }, project_variant: true },
      },
    });
    const arrResult = [];
    for (const item of data) {
      arrResult.push({ ...item, type: 'Sewing' });
    }
    return arrResult;
  }

  async findProjectConfirmPackaging(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      return [];
    }
    const data = await this.projectAccessoriesPackagingRepository.find({
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        vendor_material: {
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          project_variant: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
          detail: {
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
        vendor_material: {
          id: true,
          project_detail_id: true,
          project_variant_id: true,
          project_variant: {
            id: true,
            project_detail_id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            project_vendor_material_accessories_packaging_id: true,
            vendor_id: true,
            total_price: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            vendors: {
              id: true,
              company_name: true,
            },
          },
        },
      },
      relations: {
        vendor_material: { detail: { vendors: true }, project_variant: true },
      },
    });
    const arrResult = [];
    for (const item of data) {
      arrResult.push({ ...item, type: 'Packaging' });
    }
    return arrResult;
  }

  async upsertDetailMaterial(
    project_id: number,
    project_detail_id: number,
    createProjectMaterialDto: CreateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    return createProjectMaterialDto;
  }
  async findMaterialName(project_detail_id) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      return [];
    }
    const fabric = await this.projectFabricRepository.find({
      select: {
        id: true,
        project_material_id: true,
        fabric_id: true,
        name: true,
        category: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return fabric;
  }
  async transactionUpdate(
    project_detail_id: number,
    project_material_id: number,
    updateProjectMaterialDto: UpdateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    const arrVariantId =
      await this.projectVariantService.findVariantIdsByProjectDetailId(
        project_detail_id,
      );
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.update(
        ProjectMaterialEntity,
        project_material_id,
        {
          project_detail_id,
          material_source: updateProjectMaterialDto.material_source,
          total_price: updateProjectMaterialDto.total_price,
          fabric_percentage_of_loss:
            updateProjectMaterialDto.fabric_percentage_of_loss
              ? updateProjectMaterialDto.fabric_percentage_of_loss
              : 0,
          sewing_accessories_percentage_of_loss:
            updateProjectMaterialDto.sewing_accessories_percentage_of_loss
              ? updateProjectMaterialDto.sewing_accessories_percentage_of_loss
              : 0,
          packaging_accessories_percentage_of_loss:
            updateProjectMaterialDto.packaging_accessories_percentage_of_loss
              ? updateProjectMaterialDto.packaging_accessories_percentage_of_loss
              : 0,
          packaging_instructions:
            updateProjectMaterialDto.packaging_instructions,
          created_at: new Date().toISOString(),
          created_by: user_id,
          finished_goods_percentage_of_loss:
            updateProjectMaterialDto.finished_goods_percentage_of_loss
              ? updateProjectMaterialDto.finished_goods_percentage_of_loss
              : 0,
        },
      );
      // fabric
      if (
        Array.isArray(updateProjectMaterialDto.fabric) &&
        updateProjectMaterialDto.fabric.length > 0
      ) {
        for (const fabric of updateProjectMaterialDto.fabric) {
          fabric.project_material_id = project_material_id;
          if (fabric.method_type === 'new') {
            delete fabric.method_type;
            delete fabric.id;
            const projectFabric = await queryRunner.manager.insert(
              ProjectFabricEntity,
              fabric,
            );
            if (Array.isArray(arrVariantId) && arrVariantId.length > 0) {
              for (const variantId of arrVariantId) {
                await queryRunner.manager.insert(
                  ProjectVendorMaterialFabricEntity,
                  {
                    project_detail_id,
                    project_fabric_id: projectFabric.raw[0].id,
                    project_variant_id: variantId,
                  },
                );
              }
            }
          } else if (fabric.method_type === 'edit') {
            delete fabric.method_type;
            await queryRunner.manager.upsert(ProjectFabricEntity, fabric, {
              skipUpdateIfNoValuesChanged: true,
              conflictPaths: { id: true },
            });
          } else if (fabric.method_type === 'delete') {
            await queryRunner.manager.delete(ProjectFabricEntity, {
              id: fabric.id,
            });
            await queryRunner.manager.delete(
              ProjectVendorMaterialFabricEntity,
              {
                project_detail_id,
                project_fabric_id: fabric.id,
              },
            );
          }
        }
      }
      //accessories sewing
      if (
        Array.isArray(updateProjectMaterialDto.accessories_sewing) &&
        updateProjectMaterialDto.accessories_sewing.length > 0
      ) {
        for (const sewing of updateProjectMaterialDto.accessories_sewing) {
          sewing.project_material_id = project_material_id;
          if (sewing.method_type === 'new') {
            delete sewing.method_type;
            delete sewing.id;
            const projectSewing = await queryRunner.manager.insert(
              ProjectAccessoriesSewingEntity,
              sewing,
            );
            if (Array.isArray(arrVariantId) && arrVariantId.length > 0) {
              for (const variantId of arrVariantId) {
                await queryRunner.manager.insert(
                  ProjectVendorMaterialAccessoriesSewingEntity,
                  {
                    project_detail_id,
                    project_accessories_sewing_id: projectSewing.raw[0].id,
                    project_variant_id: variantId,
                  },
                );
              }
            }
          } else if (sewing.method_type === 'edit') {
            delete sewing.method_type;
            await queryRunner.manager.upsert(
              ProjectAccessoriesSewingEntity,
              sewing,
              {
                skipUpdateIfNoValuesChanged: true,
                conflictPaths: { id: true },
              },
            );
          } else if (sewing.method_type === 'delete') {
            await queryRunner.manager.delete(ProjectAccessoriesSewingEntity, {
              id: sewing.id,
            });
            await queryRunner.manager.delete(
              ProjectVendorMaterialAccessoriesSewingEntity,
              {
                project_detail_id,
                project_accessories_sewing_id: sewing.id,
              },
            );
          }
        }
      }
      // //accessories packaging
      if (
        Array.isArray(updateProjectMaterialDto.accessories_packaging) &&
        updateProjectMaterialDto.accessories_packaging.length > 0
      ) {
        for (const packaging of updateProjectMaterialDto.accessories_packaging) {
          packaging.project_material_id = project_material_id;
          if (packaging.method_type === 'new') {
            delete packaging.method_type;
            delete packaging.id;
            const projectPackaging = await queryRunner.manager.insert(
              ProjectAccessoriesPackagingEntity,
              packaging,
            );
            if (Array.isArray(arrVariantId) && arrVariantId.length > 0) {
              for (const variantId of arrVariantId) {
                await queryRunner.manager.insert(
                  ProjectVendorMaterialAccessoriesPackagingEntity,
                  {
                    project_detail_id,
                    project_accessories_packaging_id:
                      projectPackaging.raw[0].id,
                    project_variant_id: variantId,
                  },
                );
              }
            }
          } else if (packaging.method_type === 'edit') {
            delete packaging.method_type;
            await queryRunner.manager.upsert(
              ProjectAccessoriesPackagingEntity,
              packaging,
              {
                skipUpdateIfNoValuesChanged: true,
                conflictPaths: { id: true },
              },
            );
          } else if (packaging.method_type === 'delete') {
            await queryRunner.manager.delete(
              ProjectAccessoriesPackagingEntity,
              {
                id: packaging.id,
              },
            );
            await queryRunner.manager.delete(
              ProjectVendorMaterialAccessoriesPackagingEntity,
              {
                project_detail_id,
                project_accessories_packaging_id: packaging.id,
              },
            );
          }
        }
      }
      await queryRunner.commitTransaction();
      return { id: project_material_id, ...updateProjectMaterialDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findMaterialSelectId(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
      order: {
        id: 'DESC',
      },
    });
    return findProjectMaterialId;
  }
  async findIdsMaterialFabricSewingPackaging(project_detail_id) {
    const materialId = await this.findMaterialSelectId(project_detail_id);
    const fabric = await this.projectFabricRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
      },
    });

    const sewing = await this.projectAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
      },
    });

    const packaging = await this.projectAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_material_id: true,
      },
      where: {
        project_material_id: materialId.id,
      },
    });
    return { fabric, sewing, packaging };
  }
}
