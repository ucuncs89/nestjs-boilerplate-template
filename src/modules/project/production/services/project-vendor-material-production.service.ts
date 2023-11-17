import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { ProjectVendorMaterialProductionDetailDto } from '../dto/project-vendor-material-production.dto';

@Injectable()
export class ProjectVendorMaterialProductionService {
  constructor(
    @InjectRepository(ProjectVendorMaterialFabricDetailEntity)
    private projectVendorMaterialFabricDetailRepository: Repository<ProjectVendorMaterialFabricDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingDetailEntity)
    private projectVendorMaterialAccessoriesSewingDetailRepository: Repository<ProjectVendorMaterialAccessoriesSewingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingDetailEntity)
    private projectVendorMaterialAccessoriesPackagingDetailRepository: Repository<ProjectVendorMaterialAccessoriesPackagingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialFinishedGoodDetailEntity)
    private projectVendorMaterialFinishedGoodDetailRepository: Repository<ProjectVendorMaterialFinishedGoodDetailEntity>,

    @InjectRepository(ProjectVendorMaterialFabricEntity)
    private projectVendorMaterialFabricRepository: Repository<ProjectVendorMaterialFabricEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingEntity)
    private projectVendorMaterialAccessoriesSewingRepository: Repository<ProjectVendorMaterialAccessoriesSewingEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingEntity)
    private projectVendorMaterialAccessoriesPackagingRepository: Repository<ProjectVendorMaterialAccessoriesPackagingEntity>,

    @InjectRepository(ProjectVendorMaterialFinishedGoodEntity)
    private projectVendorMaterialFinishedGoodRepository: Repository<ProjectVendorMaterialFinishedGoodEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,
  ) {}
  async createVendorMaterialFabricDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const fabric = this.projectVendorMaterialFabricDetailRepository.create({
        ...projectVendorMaterialProductionDetailDto,
        project_vendor_material_fabric_id: vendor_material_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorMaterialFabricDetailRepository.save(fabric);
      return fabric;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialSewingDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const sewing =
        this.projectVendorMaterialAccessoriesSewingDetailRepository.create({
          ...projectVendorMaterialProductionDetailDto,
          project_vendor_material_accessories_sewing_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialAccessoriesSewingDetailRepository.save(
        sewing,
      );
      return sewing;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialPackagingDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const packaging =
        this.projectVendorMaterialAccessoriesPackagingDetailRepository.create({
          ...projectVendorMaterialProductionDetailDto,
          project_vendor_material_accessories_packaging_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialAccessoriesPackagingDetailRepository.save(
        packaging,
      );
      return packaging;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialFinishedGoodDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const finishedGoods =
        this.projectVendorMaterialFinishedGoodDetailRepository.create({
          ...projectVendorMaterialProductionDetailDto,
          project_vendor_material_finished_good_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialFinishedGoodDetailRepository.save(
        finishedGoods,
      );
      return finishedGoods;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialFabricDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFabricDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialProductionDetailDto.vendor_id,
            quantity: projectVendorMaterialProductionDetailDto.quantity,
            quantity_unit:
              projectVendorMaterialProductionDetailDto.quantity_unit,
            price: projectVendorMaterialProductionDetailDto.price,
            price_unit: projectVendorMaterialProductionDetailDto.price_unit,
            total_price: projectVendorMaterialProductionDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialSewingDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesSewingDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialProductionDetailDto.vendor_id,
            quantity: projectVendorMaterialProductionDetailDto.quantity,
            quantity_unit:
              projectVendorMaterialProductionDetailDto.quantity_unit,
            price: projectVendorMaterialProductionDetailDto.price,
            price_unit: projectVendorMaterialProductionDetailDto.price_unit,
            total_price: projectVendorMaterialProductionDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialPackagingDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesPackagingDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialProductionDetailDto.vendor_id,
            quantity: projectVendorMaterialProductionDetailDto.quantity,
            quantity_unit:
              projectVendorMaterialProductionDetailDto.quantity_unit,
            price: projectVendorMaterialProductionDetailDto.price,
            price_unit: projectVendorMaterialProductionDetailDto.price_unit,
            total_price: projectVendorMaterialProductionDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialFinishedGoodDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialProductionDetailDto: ProjectVendorMaterialProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFinishedGoodDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialProductionDetailDto.vendor_id,
            quantity: projectVendorMaterialProductionDetailDto.quantity,
            quantity_unit:
              projectVendorMaterialProductionDetailDto.quantity_unit,
            price: projectVendorMaterialProductionDetailDto.price,
            price_unit: projectVendorMaterialProductionDetailDto.price_unit,
            total_price: projectVendorMaterialProductionDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialFabricDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFabricDetailRepository.delete({
          project_vendor_material_fabric_id: vendor_material_id,
          id: vendor_material_detail_id,
        });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialSewingDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesSewingDetailRepository.delete(
          {
            project_vendor_material_accessories_sewing_id: vendor_material_id,
            id: vendor_material_detail_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialPackagingDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesPackagingDetailRepository.delete(
          {
            project_vendor_material_accessories_packaging_id:
              vendor_material_id,
            id: vendor_material_detail_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialFinishedGoodDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFinishedGoodDetailRepository.delete({
          project_vendor_material_finished_good_id: vendor_material_id,
          id: vendor_material_detail_id,
        });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findVendorMaterialFabricDetailByProjecDetailId(
    project_detail_id: number,
  ) {
    const findFabric = await this.projectVendorMaterialFabricRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!findFabric[0]) {
      return [];
    }
    const arrIds = findFabric.map((v) => v.id);

    const dataFabric = await this.projectVendorMaterialFabricDetailRepository
      .query(`select
      pvmfd.vendor_id,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name
    from
      project_vendor_material_fabric_detail pvmfd
    left join 
      vendors v on
      v.id = pvmfd.vendor_id
    where
      pvmfd.project_vendor_material_fabric_id in (${arrIds})
    group by
      pvmfd.vendor_id,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name`);
    if (dataFabric.length <= 0) {
      return [];
    }
    const arrVendorIdsDataFabric = dataFabric.map((v) => v.vendor_id);

    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrVendorIdsDataFabric),
        project_detail_id,
        material_type: 'Fabric',
        vendor_type: 'Material',
      },
      select: {
        id: true,
        material_type: true,
        project_detail_id: true,
        purchase_order_id: true,
        relation_id: true,
        vendor_type: true,
        vendor_id: true,
      },
    });
    // Combine arrays based on relation_id and id
    const combinedArray = dataFabric.map((fabricItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) => order.vendor_id === fabricItem.vendor_id,
      );

      return {
        ...fabricItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        type: 'Fabric',
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }

  async findVendorMaterialSewingDetailByProjecDetailId(
    project_detail_id: number,
  ) {
    const findSewing =
      await this.projectVendorMaterialAccessoriesSewingRepository.find({
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
    if (!findSewing[0]) {
      return [];
    }
    const arrIds = findSewing.map((v) => v.id);

    const dataSewing =
      await this.projectVendorMaterialAccessoriesSewingDetailRepository.query(
        `select
          pvmasd.vendor_id,
          v.company_name,
          v.company_phone_number,
          v.company_address,
          v.bank_account_number,
          v.bank_account_holder_name,
          v.bank_name
        from
          project_vendor_material_accessories_sewing_detail pvmasd
        left join
              vendors v on
          v.id = pvmasd.vendor_id
        where
          pvmasd.project_vendor_material_accessories_sewing_id in (${arrIds})
        group by
          pvmasd.vendor_id,
          v.company_name,
          v.company_phone_number,
          v.company_address,
          v.bank_account_number,
          v.bank_account_holder_name,
          v.bank_name`,
      );
    if (dataSewing.length <= 0) {
      return [];
    }
    const arrVendorIdsDataSewing = dataSewing.map((v) => v.vendor_id);
    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrVendorIdsDataSewing),
        project_detail_id,
        material_type: 'Sewing',
        vendor_type: 'Material',
      },
      select: {
        id: true,
        material_type: true,
        project_detail_id: true,
        purchase_order_id: true,
        relation_id: true,
        vendor_type: true,
        vendor_id: true,
      },
    });
    // Combine arrays based on vendor_id and vendor_id
    const combinedArray = dataSewing.map((sewingItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) => order.vendor_id === sewingItem.vendor_id,
      );

      return {
        ...sewingItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        type: 'Sewing',
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }

  async findVendorMaterialPackagingDetailByProjecDetailId(
    project_detail_id: number,
  ) {
    const findPackaging =
      await this.projectVendorMaterialAccessoriesPackagingRepository.find({
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
    if (!findPackaging[0]) {
      return [];
    }
    const arrIds = findPackaging.map((v) => v.id);

    const dataPackaging =
      await this.projectVendorMaterialAccessoriesPackagingDetailRepository.query(
        `select
       pvmapd.vendor_id,
       v.company_name,
       v.company_phone_number,
       v.company_address,
       v.bank_account_number,
       v.bank_account_holder_name,
       v.bank_name
     from
       project_vendor_material_accessories_packaging_detail pvmapd
     left join
           vendors v on
       v.id = pvmapd.vendor_id
     where
       pvmapd.project_vendor_material_accessories_packaging_id in (${arrIds})
     group by
       pvmapd.vendor_id,
       v.company_name,
       v.company_phone_number,
       v.company_address,
       v.bank_account_number,
       v.bank_account_holder_name,
       v.bank_name`,
      );
    if (dataPackaging.length <= 0) {
      return [];
    }
    const arrVendorIdsDataPackaging = dataPackaging.map((v) => v.vendor_id);
    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrVendorIdsDataPackaging),
        project_detail_id,
        material_type: 'Packaging',
        vendor_type: 'Material',
      },
      select: {
        id: true,
        material_type: true,
        project_detail_id: true,
        purchase_order_id: true,
        relation_id: true,
        vendor_type: true,
        vendor_id: true,
      },
    });
    // Combine arrays based on relation_id and id
    const combinedArray = dataPackaging.map((packagingItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) => order.vendor_id === packagingItem.vendor_id,
      );
      return {
        ...packagingItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        type: 'Packaging',
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }

  async findVendorMaterialFinishedGoodDetailByProjecDetailId(
    project_detail_id,
  ) {
    const findFinishedGood =
      await this.projectVendorMaterialFinishedGoodRepository.find({
        where: {
          project_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
    if (!findFinishedGood[0]) {
      return [];
    }
    const arrIds = findFinishedGood.map((v) => v.id);

    const dataFinishedGood = await this
      .projectVendorMaterialFinishedGoodDetailRepository.query(`
    select
      pvmfgd.vendor_id,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name
    from
      project_vendor_material_finished_good_detail pvmfgd
    left join
          vendors v on
      v.id = pvmfgd.vendor_id
    where
      pvmfgd.project_vendor_material_finished_good_id  in (${arrIds})
    group by
      pvmfgd.vendor_id,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name`);
    if (dataFinishedGood.length <= 0) {
      return [];
    }
    const arrVendorIdsDataFinishedGood = dataFinishedGood.map(
      (v) => v.vendor_id,
    );
    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrVendorIdsDataFinishedGood),
        project_detail_id,
        material_type: 'Finished goods',
        vendor_type: 'Material',
      },
      select: {
        id: true,
        material_type: true,
        project_detail_id: true,
        purchase_order_id: true,
        relation_id: true,
        vendor_type: true,
        vendor_id: true,
      },
    });
    // Combine arrays based on relation_id and id
    const combinedArray = dataFinishedGood.map((finishedItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) => order.vendor_id === finishedItem.vendor_id,
      );

      return {
        ...finishedItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        type: 'Finished goods',
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }
}
