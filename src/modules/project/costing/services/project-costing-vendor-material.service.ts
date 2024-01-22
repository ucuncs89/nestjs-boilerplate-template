import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { ProjectCostingVendorMaterialDto } from '../dto/project-costing-vendor-material.dto';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingVendorMaterialService {
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
    projectCostingVendorMaterialDto: ProjectCostingVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const data = this.projectVendorMaterialDetailRepository.create({
        ...projectCostingVendorMaterialDto,
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
    projectCostingVendorMaterialDto: ProjectCostingVendorMaterialDto,
    user_id,
    i18n,
  ) {
    try {
      const data = await this.projectVendorMaterialDetailRepository.update(
        {
          id: vendor_material_detail_id,
        },
        {
          vendor_id: projectCostingVendorMaterialDto.vendor_id,
          quantity: projectCostingVendorMaterialDto.quantity,
          quantity_unit: projectCostingVendorMaterialDto.quantity_unit,
          price: projectCostingVendorMaterialDto.price,
          price_unit: projectCostingVendorMaterialDto.price_unit,
          total_price: projectCostingVendorMaterialDto.total_price,
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
      console.log(vendor_material_id);

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
        section_type: true,
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
        section_type: StatusProjectEnum.Costing,
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
}
