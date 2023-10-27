import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectVendorMaterialFabricDto } from '../dto/project-vendor-material-fabric.dto';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialSewingDto } from '../dto/project-vendor-material-sewing.dto';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialPackagingDto } from '../dto/project-vendor-material-packaging.dto';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';
import { ProjectVendorMaterialFinishedGoodDto } from '../dto/project-vendor-material-finished-good.dto';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';

@Injectable()
export class ProjectVendorMaterialService {
  constructor(
    @InjectRepository(ProjectVendorMaterialFabricEntity)
    private projectVendorMaterialFabricRepository: Repository<ProjectVendorMaterialFabricEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingEntity)
    private projectVendorMaterialAccessoriesPackagingRepository: Repository<ProjectVendorMaterialAccessoriesPackagingEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingEntity)
    private projectVendorMaterialAccessoriesSewingRepository: Repository<ProjectVendorMaterialAccessoriesSewingEntity>,

    private connection: Connection,
  ) {}

  async createVendorMaterialFabric(
    project_detail_id,
    projectVendorMaterialDto: ProjectVendorMaterialFabricDto[],
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const vendorMaterial of projectVendorMaterialDto) {
        const material = await queryRunner.manager.findOne(
          ProjectVendorMaterialFabricEntity,
          {
            where: {
              project_detail_id,
              project_variant_id: vendorMaterial.project_variant_id,
              project_fabric_id: vendorMaterial.project_fabric_id,
            },
            select: {
              id: true,
            },
          },
        );
        await queryRunner.manager.delete(ProjectVendorMaterialFabricEntity, {
          project_detail_id,
          project_variant_id: vendorMaterial.project_variant_id,
          project_fabric_id: vendorMaterial.project_fabric_id,
        });
        if (material) {
          await queryRunner.manager.delete(
            ProjectVendorMaterialFabricDetailEntity,
            { project_vendor_material_fabric_id: material.id },
          );
        }
        const materialFabric = await queryRunner.manager.insert(
          ProjectVendorMaterialFabricEntity,
          {
            project_detail_id,
            project_variant_id: vendorMaterial.project_variant_id,
            project_fabric_id: vendorMaterial.project_fabric_id,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(vendorMaterial.detail) &&
          vendorMaterial.detail.length > 0
        ) {
          for (const detail of vendorMaterial.detail) {
            detail.project_vendor_material_fabric_id = materialFabric.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVendorMaterialFabricDetailEntity,
            vendorMaterial.detail,
          );
        }

        arrResult.push({
          id: materialFabric.raw[0].id,
          ...vendorMaterial,
        });
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
  async createVendorMaterialSewing(
    project_detail_id,
    projectVendorMaterialSewingDto: ProjectVendorMaterialSewingDto[],
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const sewingMaterial of projectVendorMaterialSewingDto) {
        const material = await queryRunner.manager.findOne(
          ProjectVendorMaterialAccessoriesSewingEntity,
          {
            where: {
              project_detail_id,
              project_variant_id: sewingMaterial.project_variant_id,
              project_accessories_sewing_id:
                sewingMaterial.project_accessories_sewing_id,
            },
            select: {
              id: true,
            },
          },
        );
        await queryRunner.manager.delete(
          ProjectVendorMaterialAccessoriesSewingEntity,
          {
            project_detail_id,
            project_variant_id: sewingMaterial.project_variant_id,
            project_accessories_sewing_id:
              sewingMaterial.project_accessories_sewing_id,
          },
        );
        if (material) {
          await queryRunner.manager.delete(
            ProjectVendorMaterialAccessoriesSewingDetailEntity,
            { project_vendor_material_accessories_sewing_id: material.id },
          );
        }
        const sewing = await queryRunner.manager.insert(
          ProjectVendorMaterialAccessoriesSewingEntity,
          {
            project_detail_id,
            project_variant_id: sewingMaterial.project_variant_id,
            project_accessories_sewing_id:
              sewingMaterial.project_accessories_sewing_id,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(sewingMaterial.detail) &&
          sewingMaterial.detail.length > 0
        ) {
          for (const detail of sewingMaterial.detail) {
            detail.project_vendor_material_accessories_sewing_id =
              sewing.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVendorMaterialAccessoriesSewingDetailEntity,
            sewingMaterial.detail,
          );
        }

        arrResult.push({
          id: sewing.raw[0].id,
          ...sewingMaterial,
        });
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
  async createVendorMaterialPackaging(
    project_detail_id,
    projectVendorMaterialPackagingDto: ProjectVendorMaterialPackagingDto[],
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const packagingMaterial of projectVendorMaterialPackagingDto) {
        const material = await queryRunner.manager.findOne(
          ProjectVendorMaterialAccessoriesPackagingEntity,
          {
            where: {
              project_detail_id,
              project_variant_id: packagingMaterial.project_variant_id,
              project_accessories_packaging_id:
                packagingMaterial.project_accessories_packaging_id,
            },
            select: {
              id: true,
            },
          },
        );
        await queryRunner.manager.delete(
          ProjectVendorMaterialAccessoriesPackagingEntity,
          {
            project_detail_id,
            project_variant_id: packagingMaterial.project_variant_id,
            project_accessories_packaging_id:
              packagingMaterial.project_accessories_packaging_id,
          },
        );
        if (material) {
          await queryRunner.manager.delete(
            ProjectVendorMaterialAccessoriesPackagingDetailEntity,
            { project_vendor_material_accessories_packaging_id: material.id },
          );
        }
        const packaging = await queryRunner.manager.insert(
          ProjectVendorMaterialAccessoriesPackagingEntity,
          {
            project_detail_id,
            project_variant_id: packagingMaterial.project_variant_id,
            project_accessories_packaging_id:
              packagingMaterial.project_accessories_packaging_id,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(packagingMaterial.detail) &&
          packagingMaterial.detail.length > 0
        ) {
          for (const detail of packagingMaterial.detail) {
            detail.project_vendor_material_accessories_packaging_id =
              packaging.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVendorMaterialAccessoriesPackagingDetailEntity,
            packagingMaterial.detail,
          );
        }

        arrResult.push({
          id: packaging.raw[0].id,
          ...packagingMaterial,
        });
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

  async createVendorMaterialFinishedGood(
    project_detail_id,
    projectVendorMaterialFinishedGoodDto: ProjectVendorMaterialFinishedGoodDto[],
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const finishedGoodMaterial of projectVendorMaterialFinishedGoodDto) {
        const material = await queryRunner.manager.findOne(
          ProjectVendorMaterialFinishedGoodEntity,
          {
            where: {
              project_detail_id,
              project_variant_id: finishedGoodMaterial.project_variant_id,
            },
            select: {
              id: true,
            },
          },
        );
        await queryRunner.manager.delete(
          ProjectVendorMaterialFinishedGoodEntity,
          {
            project_detail_id,
            project_variant_id: finishedGoodMaterial.project_variant_id,
          },
        );
        if (material) {
          await queryRunner.manager.delete(
            ProjectVendorMaterialFinishedGoodDetailEntity,
            { project_vendor_material_finished_good_id: material.id },
          );
        }
        const packaging = await queryRunner.manager.insert(
          ProjectVendorMaterialFinishedGoodEntity,
          {
            project_detail_id,
            project_variant_id: finishedGoodMaterial.project_variant_id,
            created_at: new Date().toISOString(),
            created_by: user_id,
          },
        );
        if (
          Array.isArray(finishedGoodMaterial.detail) &&
          finishedGoodMaterial.detail.length > 0
        ) {
          for (const detail of finishedGoodMaterial.detail) {
            detail.project_vendor_material_finished_good_id =
              packaging.raw[0].id;
          }
          await queryRunner.manager.insert(
            ProjectVendorMaterialFinishedGoodDetailEntity,
            finishedGoodMaterial.detail,
          );
        }

        arrResult.push({
          id: packaging.raw[0].id,
          ...finishedGoodMaterial,
        });
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

  async findVendorMaterialFabric(project_detail_id: number) {
    const data = await this.projectVendorMaterialFabricRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_variant_id: true,
        project_fabric_id: true,
        detail: {
          vendor_id: true,
          quantity: true,
          quantity_unit: true,
          price: true,
          price_unit: true,
          total_price: true,
        },
      },
      relations: {
        detail: true,
      },
    });
    return data;
  }
  async findVendorMaterialSewing(project_detail_id: number) {
    const data =
      await this.projectVendorMaterialAccessoriesSewingRepository.find({
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        select: {
          id: true,
          project_variant_id: true,
          project_accessories_sewing_id: true,
          detail: {
            vendor_id: true,
            quantity: true,
            quantity_unit: true,
            price: true,
            price_unit: true,
            total_price: true,
          },
        },
        relations: {
          detail: true,
        },
      });
    return data;
  }
  async findVendorMaterialPackaging(project_detail_id: number) {
    const data =
      await this.projectVendorMaterialAccessoriesPackagingRepository.find({
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        select: {
          id: true,
          project_variant_id: true,
          project_accessories_packaging_id: true,
          detail: {
            vendor_id: true,
            quantity: true,
            quantity_unit: true,
            price: true,
            price_unit: true,
            total_price: true,
          },
        },
        relations: {
          detail: true,
        },
      });
    return data;
  }
}
