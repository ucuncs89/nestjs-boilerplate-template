import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
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
      const data = await this.projectVendorMaterialDetailRepository.update(
        {
          id: vendor_material_detail_id,
        },
        {
          vendor_id: projectPlanningVendorMaterialDto.vendor_id,
          quantity: projectPlanningVendorMaterialDto.quantity,
          quantity_unit: projectPlanningVendorMaterialDto.quantity_unit,
          price: projectPlanningVendorMaterialDto.price,
          price_unit: projectPlanningVendorMaterialDto.price_unit,
          total_price: projectPlanningVendorMaterialDto.total_price,
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
      this.projectVendorMaterialRepository.save(vendorMaterial);
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
  ) {
    const data = await this.projectVendorMaterialDetailRepository.update(
      {
        id: project_vendor_material_detail_id,
      },
      { status_purchase_order: status, purchase_order_detail_id },
    );
    return data;
  }
}
