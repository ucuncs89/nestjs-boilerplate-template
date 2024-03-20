import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningVendorMaterialDto } from '../dto/project-planning-vendor-material.dto';
import { StatusPurchaseOrderEnum } from 'src/modules/purchase-order/dto/purchase-order.dto';

@Injectable()
export class ProjectPlanningVendorMaterialService {
  constructor(
    @InjectRepository(ProjectVendorMaterialDetailEntity)
    private projectVendorMaterialDetailRepository: Repository<ProjectVendorMaterialDetailEntity>,

    @InjectRepository(ProjectVendorMaterialEntity)
    private projectVendorMaterialRepository: Repository<ProjectVendorMaterialEntity>,

    private connection: Connection,
  ) {}

  async createVendorMaterialDetail(
    project_id,
    vendor_material_id,
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const data = this.projectVendorMaterialDetailRepository.create({
        ...projectPlanningVendorMaterialDto,
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
    project_id,
    vendor_material_detail_id,
    projectPlanningVendorMaterialDto: ProjectPlanningVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const materialDetail =
        await this.projectVendorMaterialDetailRepository.findOne({
          where: {
            id: vendor_material_detail_id,
          },
        });
      const old_purchase_order_detail_id =
        materialDetail.purchase_order_detail_id;
      const old_purchase_order_id = materialDetail.purchase_order_id;

      materialDetail.vendor_id = projectPlanningVendorMaterialDto.vendor_id;
      materialDetail.quantity = projectPlanningVendorMaterialDto.quantity;
      materialDetail.quantity_unit =
        projectPlanningVendorMaterialDto.quantity_unit;
      materialDetail.price = projectPlanningVendorMaterialDto.price;
      materialDetail.price_unit = projectPlanningVendorMaterialDto.price_unit;
      materialDetail.total_price = projectPlanningVendorMaterialDto.total_price;
      materialDetail.updated_at = new Date().toISOString();
      materialDetail.updated_by = user_id;
      materialDetail.status_purchase_order = null;
      materialDetail.purchase_order_detail_id = null;
      materialDetail.purchase_order_id = null;
      await this.projectVendorMaterialDetailRepository.save(materialDetail);
      return {
        ...materialDetail,
        old_purchase_order_detail_id,
        old_purchase_order_id,
      };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteVendorMaterialDetail(
    vendor_material_id: number,
    vendor_material_detail_id: number,
  ) {
    const purchaseOrderExist =
      await this.projectVendorMaterialDetailRepository.findOne({
        where: {
          project_vendor_material_id: vendor_material_id,
          id: vendor_material_detail_id,
        },
        select: {
          purchase_order_detail_id: true,
          purchase_order_id: true,
        },
      });

    const old_purchase_order_detail_id =
      purchaseOrderExist.purchase_order_detail_id;
    const old_purchase_order_id = purchaseOrderExist.purchase_order_id;
    try {
      const data = await this.projectVendorMaterialDetailRepository.delete({
        project_vendor_material_id: vendor_material_id,
        id: vendor_material_detail_id,
      });
      return { ...data, old_purchase_order_detail_id, old_purchase_order_id };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateTotalQuantitySubtotal(vendor_material_id: number) {
    try {
      const vendorMaterial = await this.projectVendorMaterialRepository.findOne(
        {
          where: {
            id: vendor_material_id,
          },
          relations: { project_variant: true },
        },
      );
      const variant_total_item = vendorMaterial.project_variant.total_item || 0;
      const total_quantity =
        await this.projectVendorMaterialDetailRepository.sum('quantity', {
          project_vendor_material_id: vendor_material_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        });

      const sumPrice = await this.projectVendorMaterialDetailRepository.sum(
        'total_price',
        {
          project_vendor_material_id: vendor_material_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      );
      vendorMaterial.total_consumption = total_quantity ? total_quantity : 0;
      vendorMaterial.total_item = variant_total_item;
      vendorMaterial.total_price = sumPrice ? sumPrice : 0;
      await this.projectVendorMaterialRepository.save(vendorMaterial);
    } catch (error) {
      console.log(error);
    }
  }
  async findVendorMaterialByProjectId(project_id: number) {
    const data = await this.projectVendorMaterialRepository.find({
      select: {
        id: true,
        project_id: true,
        project_material_item_id: true,
        project_variant_id: true,
        added_in_section: true,
        total_item: true,
        total_consumption: true,
        total_price: true,
        detail: {
          id: true,
          vendor_id: true,
          quantity: true,
          quantity_unit: true,
          total_price: true,
          price_unit: true,
          type: true,
        },
      },
      where: {
        project_id,
        added_in_section: StatusProjectEnum.Planning,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        detail: { deleted_at: IsNull(), deleted_by: IsNull() },
      },
      relations: {
        detail: true,
      },
    });
    return data;
  }
  async findNameDetail(
    vendor_material_id: number,
    vendor_material_detail_id: number,
  ) {
    const data = await this.projectVendorMaterialDetailRepository.findOne({
      where: {
        id: vendor_material_detail_id,
        project_vendor_material_id: vendor_material_id,
      },
      relations: {
        vendor_material: { project_material_item: true, project_variant: true },
      },
    });
    return data;
  }
  async updateStatusPurchaseOrder(
    project_vendor_material_detail_id: number,
    status: StatusPurchaseOrderEnum,
    purchase_order_detail_id: number,
    purchase_order_id: number,
  ) {
    const data = await this.projectVendorMaterialDetailRepository.update(
      {
        id: project_vendor_material_detail_id,
      },
      {
        status_purchase_order: status,
        purchase_order_detail_id,
        purchase_order_id,
      },
    );
    return data;
  }
}
