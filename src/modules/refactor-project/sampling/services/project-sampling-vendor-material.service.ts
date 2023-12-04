import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { GetListProjectMaterialDto } from '../dto/project-sampling-material.dto';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectSamplingVendorMaterialDto } from '../dto/project-sampling-vendor-material.dto';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';

@Injectable()
export class ProjectSamplingVendorMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,

    @InjectRepository(ProjectVendorMaterialDetailEntity)
    private projectVendorMaterialDetailRepository: Repository<ProjectVendorMaterialDetailEntity>,

    @InjectRepository(ProjectVendorMaterialEntity)
    private projectVendorMaterialRepository: Repository<ProjectVendorMaterialEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,

    private connection: Connection,
  ) {}

  async findVendorMaterialItem(
    project_detail_id,
    getListProjectMaterialDto: GetListProjectMaterialDto,
    user_id,
  ) {
    const data = await this.projectMaterialItemRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: getListProjectMaterialDto.type
          ? getListProjectMaterialDto.type
          : In(['Fabric', 'Sewing', 'Packaging']),
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
        type: true,
        project_detail_id: true,
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
            project_vendor_material_id: true,
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
    return data;
  }
  async createVendorMaterialDetail(
    project_detail_id,
    vendor_material_id,
    projectSamplingVendorMaterialDto: ProjectSamplingVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const data = this.projectVendorMaterialDetailRepository.create({
        ...projectSamplingVendorMaterialDto,
        project_vendor_material_id: vendor_material_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorMaterialDetailRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateVendorMaterialDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectSamplingVendorMaterialDto: ProjectSamplingVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const data = await this.projectVendorMaterialDetailRepository.update(
        {
          id: vendor_material_detail_id,
        },
        {
          vendor_id: projectSamplingVendorMaterialDto.vendor_id,
          quantity: projectSamplingVendorMaterialDto.quantity,
          quantity_unit: projectSamplingVendorMaterialDto.quantity_unit,
          price: projectSamplingVendorMaterialDto.price,
          price_unit: projectSamplingVendorMaterialDto.price_unit,
          total_price: projectSamplingVendorMaterialDto.total_price,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteVendorMaterialDetail(
    vendor_material_id: number,
    vendor_material_detail_id: number,
  ) {
    try {
      const data = await this.projectVendorMaterialDetailRepository.delete({
        project_vendor_material_id: vendor_material_id,
        id: vendor_material_detail_id,
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findVendorMaterialItemDetailByProjecDetailId(
    project_detail_id: number,
  ) {
    const findMaterialItem = await this.projectVendorMaterialRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!findMaterialItem[0]) {
      return [];
    }
    const arrIds = findMaterialItem.map((v) => v.id);

    const dataFabric = await this.projectVendorMaterialDetailRepository
      .query(`select
      pvmd.vendor_id,
      pvmd.type,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name
    from
      project_vendor_material_detail pvmd
    left join 
          vendors v on
      v.id = pvmd.vendor_id
    where
      pvmd.project_vendor_material_id in (${arrIds})
    group by
      pvmd.vendor_id,
      pvmd.type,
      v.company_name,
      v.company_phone_number,
      v.company_address,
      v.bank_account_number,
      v.bank_account_holder_name,
      v.bank_name`);
    if (dataFabric.length <= 0) {
      return [];
    }
    const arrVendorIds = dataFabric.map((v) => v.vendor_id);
    const arrVendorType = dataFabric.map((v) => v.type);

    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrVendorIds),
        project_detail_id,
        material_type: In(arrVendorType),
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

    const combinedArray = dataFabric.map((fabricItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) =>
          order.vendor_id === fabricItem.vendor_id &&
          order.material_type === fabricItem.type,
      );

      return {
        ...fabricItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }
}
