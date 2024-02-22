import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProjectPurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,
  ) {}
  async findAllByProjectId(project_id: number) {
    const data = await this.purchaseOrderRepository.find({
      select: { id: true, company_name: true, type: true, status: true },
      where: { project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      order: { id: 'DESC' },
    });
    return data;
  }
}
