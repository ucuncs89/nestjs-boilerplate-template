import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { GetListProjectMaterialDto } from '../dto/project-planning-material.dto';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectPlanningVendorMaterialDto } from '../dto/project-planning-vendor-material.dto';

@Injectable()
export class ProjectPlanningVendorMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,

    @InjectRepository(ProjectVendorMaterialDetailEntity)
    private projectVendorMaterialDetailRepository: Repository<ProjectVendorMaterialDetailEntity>,

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
          : In(['Fabric', 'Sewing', 'Packaging', 'Finished goods']),
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
    project_detail_id,
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
}
