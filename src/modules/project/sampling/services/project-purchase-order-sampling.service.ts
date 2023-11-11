import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectPurchaseOrderSamplingDto } from '../dto/project-purchase-order-sampling.dto';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { PurchaseOrderHistoryEntity } from 'src/entities/purchase-order/purchase_order_history.entity';

@Injectable()
export class ProjectPurchaseOrderSamplingService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,
    private connection: Connection,
  ) {}
  async createPurchaseOrder(
    project_detail_id,
    projectPurchaseOrderSamplingDto: ProjectPurchaseOrderSamplingDto,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchaseOrder = await queryRunner.manager.insert(
        PurchaseOrderEntity,
        {
          ...projectPurchaseOrderSamplingDto,
          code: 'belum',
          status: 'Submitted',
        },
      );
      await queryRunner.manager.insert(ProjectPurchaseOrderEntity, {
        project_detail_id,
        purchase_order_id: purchaseOrder.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        vendor_type: projectPurchaseOrderSamplingDto.vendor_type,
        relation_id: projectPurchaseOrderSamplingDto.relation_id,
        material_type: projectPurchaseOrderSamplingDto.material_type,
      });
      await queryRunner.manager.insert(PurchaseOrderHistoryEntity, {
        purchase_order_id: purchaseOrder.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await queryRunner.commitTransaction();
      return {
        id: purchaseOrder.raw[0].id,
        ...projectPurchaseOrderSamplingDto,
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
    projectPurchaseOrderSamplingDto: ProjectPurchaseOrderSamplingDto,
    user_id: number,
  ) {
    try {
      await this.purchaseOrderRepository.update(
        {
          id: purchase_order_id,
        },
        {
          vendor_id: projectPurchaseOrderSamplingDto.vendor_id,
          company_name: projectPurchaseOrderSamplingDto.company_name,
          company_address: projectPurchaseOrderSamplingDto.company_address,
          company_phone_number:
            projectPurchaseOrderSamplingDto.company_phone_number,
          ppn: projectPurchaseOrderSamplingDto.ppn,
          pph: projectPurchaseOrderSamplingDto.pph,
          discount: projectPurchaseOrderSamplingDto.discount,
          bank_account_number:
            projectPurchaseOrderSamplingDto.bank_account_number,
          bank_account_houlders_name:
            projectPurchaseOrderSamplingDto.bank_account_houlders_name,
          notes: projectPurchaseOrderSamplingDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          payment_term: projectPurchaseOrderSamplingDto.payment_term,
        },
      );
      return { id: purchase_order_id, ...projectPurchaseOrderSamplingDto };
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
