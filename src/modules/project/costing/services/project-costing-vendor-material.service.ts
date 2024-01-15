import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, Repository } from 'typeorm';
import { ProjectCostingVendorMaterialDto } from '../dto/project-costing-vendor-material.dto';

@Injectable()
export class ProjectCostingVendorMaterialService {
  constructor(
    @InjectRepository(ProjectVendorMaterialDetailEntity)
    private projectVendorMaterialDetailRepository: Repository<ProjectVendorMaterialDetailEntity>,
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
}
