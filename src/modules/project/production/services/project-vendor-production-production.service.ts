import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';

import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';

import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import {
  ProjectVendorProductionDetailProductionDto,
  ProjectVendorProductionDetailProductionDueDateDto,
  ProjectVendorProductionLossPercentageProductionDto,
  ProjectVendorProductionProductionDto,
} from '../dto/project-vendor-production-production.dto';

@Injectable()
export class ProjectVendorProductionProductionService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,
    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,

    private connection: Connection,
  ) {}

  async findVendorProduction(project_detail_id) {
    const data = await this.projectVendorProductionRepository.find({
      select: {
        id: true,
        project_detail_id: true,
        activity_id: true,
        activity_name: true,
        percentage_of_loss: true,
        total_quantity: true,
        sub_total_price: true,
        quantity_unit_required: true,
        vendor_production_detail: {
          id: true,
          price: true,
          quantity: true,
          quantity_unit: true,
          vendor_id: true,
          vendor_name: true,
          project_vendor_production_id: true,
          production_is_completed: true,
          production_due_date: true,
        },
      },
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: {
        vendor_production_detail: true,
      },
      order: {
        id: 'DESC',
      },
    });
    return data;
  }

  async createVendorProductionActivity(
    project_detail_id,
    projectVendorProductionProductionDto: ProjectVendorProductionProductionDto,
    user_id,
    i18n,
  ) {
    try {
      const activity = this.projectVendorProductionRepository.create({
        ...projectVendorProductionProductionDto,
        project_detail_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionRepository.save(activity);
      return activity;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async removeVendorProductionActivity(
    project_detail_id: number,
    id: number,
    user_id,
  ) {
    try {
      const data = await this.projectVendorProductionRepository.delete({
        id,
        project_detail_id,
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorProduction(
    project_detail_id,
    project_vendor_production_id: number,
    projectVendorProductionDetailProductionDto: ProjectVendorProductionDetailProductionDto,
    user_id,
    i18n,
  ) {
    try {
      const vendor = this.projectVendorProductionDetailRepository.create({
        ...projectVendorProductionDetailProductionDto,
        project_vendor_production_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionDetailRepository.save(vendor);
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return vendor;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateVendorProduction(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    projectVendorProductionDetailProductionDto: ProjectVendorProductionDetailProductionDto,
    user_id,
    i18n,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
          project_vendor_production_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectVendorProductionDetailProductionDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteVendorProductionDetail(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.delete({
        project_vendor_production_id,
        id: project_vendor_production_detail_id,
      });
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateLossPercentage(
    project_detail_id,
    projectVendorProductionLossPercentageProductionDto: ProjectVendorProductionLossPercentageProductionDto[],
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        Array.isArray(projectVendorProductionLossPercentageProductionDto) &&
        projectVendorProductionLossPercentageProductionDto.length > 0
      ) {
        for (const data of projectVendorProductionLossPercentageProductionDto) {
          await queryRunner.manager.update(
            ProjectVendorProductionEntity,
            {
              id: data.id,
              project_detail_id,
            },
            {
              percentage_of_loss: data.percentage_of_loss,
              updated_at: new Date().toISOString(),
            },
          );
        }
        await queryRunner.commitTransaction();
      }
      return projectVendorProductionLossPercentageProductionDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findVendorProductionDetailReview(project_detail_id) {
    const projectVendor = await this.findIdsVendorProduction(project_detail_id);
    if (projectVendor.length < 1) {
      return [];
    }
    const arrId = projectVendor.map((item) => item.id);
    const data = await this.projectVendorProductionDetailRepository.find({
      where: { project_vendor_production_id: In(arrId) },
      select: {
        id: true,
        project_vendor_production_id: true,
        vendor_id: true,
        vendor_name: true,
        price: true,
        quantity: true,
        quantity_unit: true,
        vendor_production: {
          id: true,
          project_detail_id: true,
          activity_id: true,
          activity_name: true,
          percentage_of_loss: true,
          total_quantity: true,
          quantity_unit_required: true,
          sub_total_price: true,
        },
      },
      relations: { vendor_production: true },
    });
    return data;
  }

  async findIdsVendorProduction(project_detail_id) {
    const data = await this.projectVendorProductionRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        activity_id: true,
        activity_name: true,
        percentage_of_loss: true,
      },
    });
    return data;
  }

  async updateTotalQuantitySubtotal(project_vendor_production_id) {
    const total_quantity =
      await this.projectVendorProductionDetailRepository.sum('quantity', {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      });
    const sumPrice = await this.projectVendorProductionDetailRepository.sum(
      'price',
      {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    );
    const update = await this.projectVendorProductionRepository.update(
      {
        id: project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      {
        total_quantity,
        sub_total_price: sumPrice,
      },
    );
    return update;
  }

  async findVendorProductionDetailPO(project_detail_id) {
    const findVendor = await this.projectVendorProductionRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!findVendor[0]) {
      return [];
    }
    const arrIds = findVendor.map((v) => v.id);
    console.log(arrIds);

    const dataVendorProduction = await this
      .projectVendorProductionDetailRepository.query(`
      select
        pvpd.vendor_id,
        v.company_name,
        v.company_phone_number,
        v.company_address,
        v.bank_account_number,
        v.bank_account_holder_name,
        v.bank_name,
        pvp.activity_name as type,
        pvp.activity_id
      from
        project_vendor_production_detail pvpd
      join vendors v on
        v.id = pvpd.vendor_id
      join project_vendor_production pvp on
        pvp.id = pvpd.project_vendor_production_id
      where
        pvpd.project_vendor_production_id in (${arrIds})
      group by
        pvpd.vendor_id,
        v.company_name,
        v.company_phone_number,
        v.company_address,
        v.bank_account_number,
        v.bank_account_holder_name,
        v.bank_name,
        pvp.activity_name,
        pvp.activity_id
     `);
    if (dataVendorProduction.length <= 0) {
      return [];
    }
    const arrIdsDataVendorProduction = dataVendorProduction.map(
      (v) => v.vendor_id,
    );
    const purchaseOrder = await this.projectPurchaseOrderRepository.find({
      where: {
        vendor_id: In(arrIdsDataVendorProduction),
        project_detail_id,
        vendor_type: 'Production',
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
    const combinedArray = dataVendorProduction.map((vendorItem) => {
      const matchingPurchaseOrders = purchaseOrder.filter(
        (order) =>
          order.vendor_id === vendorItem.vendor_id &&
          order.material_type === vendorItem.type,
      );

      return {
        ...vendorItem,
        purchase_order_id: matchingPurchaseOrders[0]?.purchase_order_id || null,
        // type: vendorItem.vendor_production.activity_name || null,
        purchase_order: matchingPurchaseOrders[0] || null,
      };
    });
    return combinedArray;
  }

  async updateVendorProductionDueDate(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    projectVendorProductionDetailProductionDueDateDto: ProjectVendorProductionDetailProductionDueDateDto,
    user_id,
    i18n,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
          project_vendor_production_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          production_due_date:
            projectVendorProductionDetailProductionDueDateDto.production_due_date,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
