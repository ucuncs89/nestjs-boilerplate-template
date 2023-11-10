import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';

@Injectable()
export class ProjectPurchaseOrderSamplingService {
  constructor(
    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,
    private connection: Connection,
  ) {}
  async createPurchaseOrder() {}
  async updatePurchaseOrder() {}
  async deleteOnePurchaseOrder() {}
}
