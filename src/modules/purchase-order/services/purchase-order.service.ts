import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from '../dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListPurchaseOrderDto } from '../dto/get-list-purchase-order.dto';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,
  ) {}
  create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return 'This action adds a new purchaseOrder';
  }

  async findAll(query: GetListPurchaseOrderDto) {
    const {
      page,
      page_size,
      sort_by,
      order_by,

      keyword,
    } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'name':
        orderObj = {
          company_name: order_by,
        };
      case 'code':
        orderObj = {
          code: order_by,
        };
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [data, total] = await this.purchaseOrderRepository.findAndCount({
      select: {
        id: true,
        code: true,
        company_name: true,
        grand_total: true,
        status: true,
      },
      where: [
        {
          company_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          code: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      ],
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      data,
      total_data: total,
    };
  }

  async findOne(id: number) {
    const data = await this.purchaseOrderRepository.findOne({
      where: { id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        code: true,
        vendor_id: true,
        company_name: true,
        company_address: true,
        company_phone_number: true,
        ppn: true,
        ppn_unit: true,
        pph: true,
        pph_unit: true,
        discount: true,
        bank_name: true,
        bank_account_number: true,
        bank_account_houlders_name: true,
        payment_term: true,
        payment_term_unit: true,
        notes: true,
        status: true,
        delivery_date: true,
        grand_total: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  async remove(id: number, user_id) {
    const data = await this.purchaseOrderRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }
}
