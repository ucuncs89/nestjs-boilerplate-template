import { Injectable } from '@nestjs/common';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';

@Injectable()
export class ProjectMaterialSamplingService {
  constructor(
    @InjectRepository(ProjectMaterialEntity)
    private projectMaterialRepository: Repository<ProjectMaterialEntity>,

    @InjectRepository(ProjectFabricEntity)
    private projectFabricRepository: Repository<ProjectFabricEntity>,

    @InjectRepository(ProjectAccessoriesSewingEntity)
    private projectAccessoriesSewingRepository: Repository<ProjectAccessoriesSewingEntity>,

    @InjectRepository(ProjectAccessoriesPackagingEntity)
    private projectAccessoriesPackagingRepository: Repository<ProjectAccessoriesPackagingEntity>,

    @InjectRepository(ProjectVendorMaterialFinishedGoodEntity)
    private projectVendorMaterialFinishedGoodRepository: Repository<ProjectVendorMaterialFinishedGoodEntity>,
  ) {}

  async findVendorMaterialFabric(project_detail_id: number) {
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

  async findVendorMaterialSewing(project_detail_id: number) {
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

  async findVendorMaterialPackaging(project_detail_id: number) {
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

  async findVendorMaterialFinishedGood(project_detail_id: number) {
    const data = await this.projectVendorMaterialFinishedGoodRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
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
          project_vendor_material_finished_good_id: true,
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

      relations: {
        detail: true,
        project_variant: true,
      },
    });
    const arrResult = [];
    for (const item of data) {
      arrResult.push({ ...item, type: 'Finished goods' });
    }
    return arrResult;
  }
}
