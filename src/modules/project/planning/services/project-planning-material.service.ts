import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import {
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
  ProjectMaterialItemEnum,
  ResponseMaterialItem,
} from '../dto/project-planning-material.dto';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';

@Injectable()
export class ProjectPlanningMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private projectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,

    @InjectRepository(ProjectVendorMaterialEntity)
    private projectVendorMaterialRepository: Repository<ProjectVendorMaterialEntity>,

    private projectPlanningApprovalService: ProjectPlanningApprovalService,

    private connection: Connection,
  ) {}
  async findAllMaterialItem(
    project_id,
    getListProjectMaterialDto: GetListProjectMaterialDto,
  ) {
    const material: ResponseMaterialItem[] =
      await this.projectMaterialItemRepository.find({
        select: {
          id: true,
          project_id: true,
          relation_id: true,
          type: true,
          name: true,
          category: true,
          used_for: true,
          cut_shape: true,
          allowance: true,
          consumption: true,
          consumption_unit: true,
          added_in_section: true,
          avg_price: true,
          total_price: true,
          created_at: true,
          vendor_material: {
            id: true,
            project_id: true,
            project_variant_id: true,
            project_material_item_id: true,
            added_in_section: true,
            total_item: true,
            total_consumption: true,
            total_price: true,
            project_variant: {
              id: true,
              name: true,
              total_item: true,
              item_unit: true,
            },
            detail: {
              id: true,
              vendor_id: true,
              type: true,
              price: true,
              price_unit: true,
              quantity: true,
              quantity_unit: true,
              total_price: true,
              vendors: { id: true, company_name: true },
            },
          },
          costing_material_item: {
            id: true,
            avg_price: true,
            total_price: true,
          },
        },
        where: {
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          project_id,
          added_in_section: StatusProjectEnum.Planning,
          type:
            getListProjectMaterialDto.type != null
              ? getListProjectMaterialDto.type
              : In(['Fabric', 'Sewing', 'Packaging', 'Finished goods']),
          costing_material_item: { deleted_at: IsNull(), deleted_by: IsNull() },
        },
        relations: {
          vendor_material: { project_variant: true, detail: { vendors: true } },
          costing_material_item: true,
        },
        order: {
          type: 'ASC',
          id: 'ASC',
        },
      });
    const approval = await this.projectPlanningApprovalService.findAllMaterial(
      project_id,
    );
    for (const data of material) {
      let passedApprovalCondition = false;
      let passedCostingCondition = false;

      for (const objApproval of approval) {
        if (objApproval.relation_id === data.id) {
          data.approval = {
            id: objApproval.relation_id,
            ...objApproval,
          };
          if (objApproval.status === StatusApprovalEnum.approved) {
            passedApprovalCondition = true;
          }
        }
      }

      if (
        data.costing_material_item !== null &&
        data.costing_material_item.avg_price >= data.avg_price
      ) {
        passedCostingCondition = true;
      }

      data.is_passed = passedApprovalCondition || passedCostingCondition;
    }

    return material;
  }
  async createMaterialItemOne(
    project_id,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.insert(
        ProjectMaterialItemEntity,
        {
          ...projectMaterialItemDto,
          project_id,
          added_in_section: StatusProjectEnum.Planning,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      const variant = await queryRunner.manager.find(ProjectVariantEntity, {
        where: {
          project_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
      if (variant.length > 0) {
        for (const dataVariant of variant) {
          await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
            project_variant_id: dataVariant.id,
            project_material_item_id: projectMaterial.raw[0].id,
            project_id,
            added_in_section: StatusProjectEnum.Planning,
          });
        }
      }
      await queryRunner.commitTransaction();

      return { ...projectMaterialItemDto, id: projectMaterial.raw[0].id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findOneMaterialItem(
    project_id: number,
    project_material_item_id: number,
  ) {
    const data = await this.projectMaterialItemRepository.findOne({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        added_in_section: true,
        diameter: true,
        diameter_unit: true,
        length: true,
        length_unit: true,
        weight: true,
        weight_unit: true,
        width: true,
        width_unit: true,
        avg_price: true,
        total_price: true,
        created_at: true,
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        project_id,
        id: project_material_item_id,
      },
    });
    return data;
  }

  async updateMaterialItemOne(
    project_id: number,
    material_item_id: number,
    projectMaterialItemDto: ProjectMaterialItemDto,
    user_id: number,
  ) {
    try {
      const data = await this.projectMaterialItemRepository.update(
        {
          project_id,
          id: material_item_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectMaterialItemDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteMaterialItemOne(
    project_id: number,
    material_item_id: number,
    user_id: number,
  ) {
    try {
      const data = await this.projectMaterialItemRepository.update(
        {
          project_id,
          id: material_item_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findMaterilIdByMaterialVendor(vendor_material_id: number) {
    const data = await this.projectVendorMaterialRepository.findOne({
      where: { id: vendor_material_id },
    });
    return data.project_material_item_id;
  }

  async updateTotalPlanningAndAvgCost(material_item_id: number) {
    try {
      const sumTotalPrice = await this.projectVendorMaterialRepository.sum(
        'total_price',
        {
          added_in_section: StatusProjectEnum.Planning,
          project_material_item_id: material_item_id,
          total_price: Not(IsNull()),
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      );

      const sumTotalConsumption =
        await this.projectVendorMaterialRepository.sum('total_consumption', {
          project_material_item_id: material_item_id,
          total_consumption: Not(IsNull()),
          added_in_section: StatusProjectEnum.Planning,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        });
      const avgPrice = sumTotalPrice
        ? sumTotalPrice
        : 0 / sumTotalConsumption
        ? sumTotalConsumption
        : 0;

      const data = await this.projectMaterialItemRepository.update(
        { id: material_item_id },
        {
          total_price: sumTotalPrice ? sumTotalPrice : 0,
          avg_price: avgPrice,
        },
      );
      return data;
    } catch (error) {
      console.log('error: trx material planning', error);

      throw new AppErrorException(error);
    }
  }
  async findRecap(project_id: number, type: ProjectMaterialItemEnum) {
    const data = await this.projectMaterialItemRepository.find({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        added_in_section: true,
        avg_price: true,
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type,
        added_in_section: In([StatusProjectEnum.Planning]),
      },
    });
    return data;
  }

  async findVendorMaterialPlanning(project_id: number) {
    const data = await this.projectMaterialItemRepository.find({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        added_in_section: true,
        avg_price: true,
        total_price: true,
        diameter: true,
        diameter_unit: true,
        length: true,
        length_unit: true,
        weight: true,
        weight_unit: true,
        width: true,
        width_unit: true,
        vendor_material: {
          id: true,
          project_id: true,
          project_variant_id: true,
          project_material_item_id: true,
          added_in_section: true,
          total_item: true,
          total_consumption: true,
          total_price: true,
          detail: {
            id: true,
            vendor_id: true,
            type: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            total_price: true,
          },
        },
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        project_id,
        planning_material_item_id: IsNull(),
        added_in_section: StatusProjectEnum.Planning,
        vendor_material: {
          added_in_section: StatusProjectEnum.Planning,
          project_id,
        },
      },
      relations: {
        vendor_material: { detail: true },
      },
      order: {
        type: 'ASC',
        id: 'ASC',
      },
    });
    return data;
  }
  async findCompareOne(relation_id: number) {
    const planning = await this.projectMaterialItemRepository.findOne({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        added_in_section: true,
        avg_price: true,
        total_price: true,
        created_at: true,
        costing_material_item_id: true,
        vendor_material: {
          id: true,
          project_id: true,
          project_variant_id: true,
          project_material_item_id: true,
          added_in_section: true,
          total_item: true,
          total_consumption: true,
          total_price: true,
          project_variant: {
            id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            vendor_id: true,
            type: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            total_price: true,
            vendors: { id: true, company_name: true },
          },
        },
        costing_material_item: {
          id: true,
          avg_price: true,
          total_price: true,
        },
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        id: relation_id,
        added_in_section: StatusProjectEnum.Planning,
        vendor_material: { added_in_section: StatusProjectEnum.Planning },
      },
      relations: {
        vendor_material: { project_variant: true, detail: { vendors: true } },
      },
      order: {
        type: 'ASC',
        id: 'ASC',
      },
    });
    if (!planning.costing_material_item_id) {
      return { costing: null, planning };
    }
    const costing = await this.projectMaterialItemRepository.findOne({
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        allowance: true,
        consumption: true,
        consumption_unit: true,
        added_in_section: true,
        avg_price: true,
        total_price: true,
        created_at: true,
        costing_material_item_id: true,
        vendor_material: {
          id: true,
          project_id: true,
          project_variant_id: true,
          project_material_item_id: true,
          added_in_section: true,
          total_item: true,
          total_consumption: true,
          total_price: true,
          project_variant: {
            id: true,
            name: true,
            total_item: true,
            item_unit: true,
          },
          detail: {
            id: true,
            vendor_id: true,
            type: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            total_price: true,
            vendors: { id: true, company_name: true },
          },
        },
        costing_material_item: {
          id: true,
          avg_price: true,
          total_price: true,
        },
      },
      where: {
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        id: planning.costing_material_item_id,
        added_in_section: StatusProjectEnum.Costing,
        vendor_material: { added_in_section: StatusProjectEnum.Costing },
      },
      relations: {
        vendor_material: { project_variant: true, detail: { vendors: true } },
      },
      order: {
        type: 'ASC',
        id: 'ASC',
      },
    });
    return { planning, costing };
  }
}
