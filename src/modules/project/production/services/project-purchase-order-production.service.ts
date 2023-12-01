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
import { ProjectPurchaseOrderProductionDto } from '../dto/project-purchase-order-production.dto';
import { PurchaseOrderService } from 'src/modules/purchase-order/services/purchase-order.service';
import { PurchaseOrderApprovalEntity } from 'src/entities/purchase-order/purchase_order_approval.entity';

@Injectable()
export class ProjectPurchaseOrderProductionService {
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
    projectPurchaseOrderProductionDto: ProjectPurchaseOrderProductionDto,
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
          ...projectPurchaseOrderProductionDto,
          code,
          status: 'Submitted',
        },
      );
      await queryRunner.manager.insert(ProjectPurchaseOrderEntity, {
        project_detail_id,
        purchase_order_id: purchaseOrder.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        vendor_type: projectPurchaseOrderProductionDto.vendor_type,
        relation_id: projectPurchaseOrderProductionDto.relation_id,
        material_type: projectPurchaseOrderProductionDto.material_type,
        vendor_id: projectPurchaseOrderProductionDto.vendor_id,
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
        ...projectPurchaseOrderProductionDto,
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
    projectPurchaseOrderProductionDto: ProjectPurchaseOrderProductionDto,
    user_id: number,
  ) {
    try {
      await this.purchaseOrderRepository.update(
        {
          id: purchase_order_id,
        },
        {
          vendor_id: projectPurchaseOrderProductionDto.vendor_id,
          company_name: projectPurchaseOrderProductionDto.company_name,
          company_address: projectPurchaseOrderProductionDto.company_address,
          company_phone_number:
            projectPurchaseOrderProductionDto.company_phone_number,
          ppn: projectPurchaseOrderProductionDto.ppn,
          pph: projectPurchaseOrderProductionDto.pph,
          discount: projectPurchaseOrderProductionDto.discount,
          bank_account_number:
            projectPurchaseOrderProductionDto.bank_account_number,
          bank_account_houlders_name:
            projectPurchaseOrderProductionDto.bank_account_houlders_name,
          notes: projectPurchaseOrderProductionDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          payment_term: projectPurchaseOrderProductionDto.payment_term,
        },
      );
      return { id: purchase_order_id, ...projectPurchaseOrderProductionDto };
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
