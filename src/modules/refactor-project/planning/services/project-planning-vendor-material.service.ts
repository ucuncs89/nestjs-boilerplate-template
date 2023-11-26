import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { GetListProjectMaterialDto } from '../dto/project-planning-material.dto';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';

@Injectable()
export class ProjectPlanningVendorMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,

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
}
