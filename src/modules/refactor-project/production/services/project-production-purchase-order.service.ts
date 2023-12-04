import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { PurchaseOrderHistoryEntity } from 'src/entities/purchase-order/purchase_order_history.entity';
import { PurchaseOrderService } from 'src/modules/purchase-order/services/purchase-order.service';
import { PurchaseOrderApprovalEntity } from 'src/entities/purchase-order/purchase_order_approval.entity';
import { ProjectProductionPurchaseOrderDto } from '../dto/project-production-purchase-order.dto';

@Injectable()
export class ProjectProductionPurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,

    private purchaseOrderServie: PurchaseOrderService,
    private connection: Connection,
  ) {}
  async createPurchaseOrder(
    project_detail_id,
    projectProductionPurchaseOrderDto: ProjectProductionPurchaseOrderDto,
    user_id,
  ) {
    const code = await this.purchaseOrderServie.generateCodePurchaseOrder();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaseOrder = await queryRunner.manager.insert(
        PurchaseOrderEntity,
        {
          code,
          ...projectProductionPurchaseOrderDto,
          status: 'Submitted',
        },
      );
      await queryRunner.manager.insert(ProjectPurchaseOrderEntity, {
        project_detail_id,
        purchase_order_id: purchaseOrder.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        vendor_type: projectProductionPurchaseOrderDto.vendor_type,
        relation_id: projectProductionPurchaseOrderDto.relation_id,
        material_type: projectProductionPurchaseOrderDto.material_type,
        vendor_id: projectProductionPurchaseOrderDto.vendor_id,
      });
      await queryRunner.manager.insert(PurchaseOrderHistoryEntity, {
        purchase_order_id: purchaseOrder.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await queryRunner.manager.insert(PurchaseOrderApprovalEntity, [
        {
          purchase_order_id: purchaseOrder.raw[0].id,
          status_desc: 'Made by',
        },
        {
          purchase_order_id: purchaseOrder.raw[0].id,
          status_desc: 'Sent by the finance team',
        },
        {
          purchase_order_id: purchaseOrder.raw[0].id,
          status_desc: 'Approved by',
        },
      ]);
      await queryRunner.commitTransaction();

      this.purchaseOrderServie.updateGrandTotal(purchaseOrder.raw[0].id);
      return {
        id: purchaseOrder.raw[0].id,
        ...projectProductionPurchaseOrderDto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new AppErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async updatePurchaseOrder(
    purchase_order_id: number,
    projectProductionPurchaseOrderDto: ProjectProductionPurchaseOrderDto,
    user_id: number,
  ) {
    try {
      await this.purchaseOrderRepository.update(
        {
          id: purchase_order_id,
        },
        {
          vendor_id: projectProductionPurchaseOrderDto.vendor_id,
          company_name: projectProductionPurchaseOrderDto.company_name,
          company_address: projectProductionPurchaseOrderDto.company_address,
          company_phone_number:
            projectProductionPurchaseOrderDto.company_phone_number,
          ppn: projectProductionPurchaseOrderDto.ppn,
          pph: projectProductionPurchaseOrderDto.pph,
          discount: projectProductionPurchaseOrderDto.discount,
          bank_account_number:
            projectProductionPurchaseOrderDto.bank_account_number,
          bank_account_houlders_name:
            projectProductionPurchaseOrderDto.bank_account_houlders_name,
          notes: projectProductionPurchaseOrderDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          payment_term: projectProductionPurchaseOrderDto.payment_term,
        },
      );
      return { id: purchase_order_id, ...projectProductionPurchaseOrderDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailPurcahseOrder(purchase_order_id) {
    const data = await this.purchaseOrderRepository.findOne({
      where: {
        id: purchase_order_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deleteOnePurchaseOrder(purchase_order_id, user_id) {
    await this.purchaseOrderRepository.update(
      { id: purchase_order_id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    await this.projectPurchaseOrderRepository.update(
      { purchase_order_id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
  }
}
