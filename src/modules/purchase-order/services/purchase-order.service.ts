import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { GetListPurchaseOrderDto } from '../dto/get-list-purchase-order.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

import {
  PurchaseApprovalDto,
  PurchaseOrderDto,
  PurchaseOrderStatusEnum,
  PurchaseOrderTypeEnum,
  StatusPurchaseOrderEnum,
} from '../dto/purchase-order.dto';
import { PurchaseOrderDetailEntity } from 'src/entities/purchase-order/purchase_order_detail.entity';
import { PurchaseOrderDetailDto } from '../dto/purchase-order-detail.dto';
import { PurchaseOrderStatusEntity } from 'src/entities/purchase-order/purchase_order_status.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,

    @InjectRepository(PurchaseOrderDetailEntity)
    private purchaseOrderDetailRepository: Repository<PurchaseOrderDetailEntity>,

    @InjectRepository(PurchaseOrderStatusEntity)
    private purchaseOrderStatusRepository: Repository<PurchaseOrderStatusEntity>,

    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    @InjectRepository(ProjectVendorMaterialDetailEntity)
    private projectVendorMaterialDetailRepository: Repository<ProjectVendorMaterialDetailEntity>,
  ) {}
  async create(purchaseOrderDto: PurchaseOrderDto, user_id: number) {
    try {
      const code = await this.generateCodePurchaseOrder();
      const purchaseOrder = this.purchaseOrderRepository.create({
        ...purchaseOrderDto,
        code,
        created_by: user_id,
        status: StatusPurchaseOrderEnum.Waiting,
        created_at: new Date().toISOString(),
      });
      await this.purchaseOrderRepository.save(purchaseOrder);

      const status = this.purchaseOrderStatusRepository.create([
        {
          purchase_order_id: purchaseOrder.id,
          status_desc: PurchaseOrderStatusEnum.CreatedByThe,
          updated_by: user_id,
          updated_at: new Date().toISOString(),
          status: StatusPurchaseOrderEnum.Approved,
        },
        {
          purchase_order_id: purchaseOrder.id,
          status_desc: PurchaseOrderStatusEnum.SendByThe,
        },
        {
          purchase_order_id: purchaseOrder.id,
          status_desc: PurchaseOrderStatusEnum.PaymentStatusConfirm,
        },
      ]);
      await this.purchaseOrderStatusRepository.save(status);
      return purchaseOrder;
    } catch (error) {
      throw new AppErrorException(error);
    }
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
        type: true,
        project_id: true,
        created_at: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async remove(id: number, user_id) {
    const data = await this.purchaseOrderRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }
  async generateCodePurchaseOrder() {
    const pad = '0000';
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    try {
      const packaging = await this.purchaseOrderRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = packaging[0] ? `${packaging[0].id + 1}` : '1';
      return `PO-${formattedDate}-${
        pad.substring(0, pad.length - id.length) + id
      }`;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findDetail(id: number) {
    const purchaseOrder = await this.findOne(id);
    const costDetails = await this.purchaseOrderDetailRepository.find({
      where: {
        purchase_order_id: id,
      },
    });
    const subGrandTotal = costDetails.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.sub_total;
    }, 0);
    const pph_result = (purchaseOrder.pph * subGrandTotal) / 100;
    const ppn_result = (purchaseOrder.ppn * subGrandTotal) / 100;
    const resultGrandTotal =
      subGrandTotal + pph_result + ppn_result - purchaseOrder.discount;
    const purchase_order_status = await this.findPurchaseOrderStatus(id);
    return {
      ...purchaseOrder,
      purchase_order_status,
      cost_details: costDetails,
      pph_result,
      ppn_result,
      total: subGrandTotal,
      grand_total: resultGrandTotal,
    };
  }

  async findByProjectIdType(
    project_id: number,
    type: PurchaseOrderTypeEnum,
    vendor_id: number,
  ) {
    const data = await this.purchaseOrderRepository.findOne({
      where: {
        vendor_id,
        project_id,
        type,
        status: StatusPurchaseOrderEnum.Waiting,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }

  async updatePurchaseOrder(
    id,
    purchaseOrderDto: PurchaseOrderDto,
    user_id: number,
  ) {
    try {
      const data = await this.purchaseOrderRepository.update(
        {
          id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          company_address: purchaseOrderDto.company_address,
          company_phone_number: purchaseOrderDto.company_phone_number,
          ppn: purchaseOrderDto.ppn,
          pph: purchaseOrderDto.pph,
          discount: purchaseOrderDto.discount,
          bank_name: purchaseOrderDto.bank_name,
          bank_account_houlders_name:
            purchaseOrderDto.bank_account_houlders_name,
          bank_account_number: purchaseOrderDto.bank_account_number,
          payment_term: purchaseOrderDto.payment_term,
          notes: purchaseOrderDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updatePurchaseOrderApproval(
    purchase_order_id: number,
    status_id: number,
    purchaseApprovalDto: PurchaseApprovalDto,
    user_id: number,
  ) {
    try {
      let updateToProject: any;
      const status = await this.purchaseOrderStatusRepository.findOne({
        where: { id: status_id, purchase_order_id },
      });
      if (!status) {
        throw new AppErrorNotFoundException();
      }
      status.updated_at = new Date().toISOString();
      status.updated_by = user_id;
      status.status = purchaseApprovalDto.status;
      status.reason = purchaseApprovalDto.reason;
      await this.purchaseOrderStatusRepository.save(status);
      if (status.status_desc === PurchaseOrderStatusEnum.PaymentStatusConfirm) {
        updateToProject = await this.updateToProject(
          purchase_order_id,
          purchaseApprovalDto.status,
        );
      }
      if (purchaseApprovalDto.status === StatusPurchaseOrderEnum.Rejected) {
        updateToProject = await this.updateToProject(
          purchase_order_id,
          purchaseApprovalDto.status,
        );
      }
      await this.purchaseOrderRepository.update(
        { id: purchase_order_id },
        { status: purchaseApprovalDto.status },
      );
      return { status, updateToProject };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async upsertPurchaseOrderDetail(
    purchase_order_id: number,
    purchaseOrderDetailDto: PurchaseOrderDetailDto,
  ): Promise<number> {
    const detail = await this.purchaseOrderDetailRepository.findOne({
      where: {
        relation_id: purchaseOrderDetailDto.relation_id,
        purchase_order_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });

    if (!detail) {
      const insert = await this.purchaseOrderDetailRepository.insert({
        purchase_order_id,
        relation_id: purchaseOrderDetailDto.relation_id,
        item: purchaseOrderDetailDto.item,
        quantity: purchaseOrderDetailDto.quantity,
        unit: purchaseOrderDetailDto.unit,
        unit_price: purchaseOrderDetailDto.unit_price,
        sub_total: purchaseOrderDetailDto.sub_total,
      });
      return insert.raw[0].id;
    } else {
      detail.item = purchaseOrderDetailDto.item;
      detail.quantity = purchaseOrderDetailDto.quantity;
      detail.unit = purchaseOrderDetailDto.unit;
      detail.unit_price = purchaseOrderDetailDto.unit_price;
      detail.sub_total = purchaseOrderDetailDto.sub_total;
      await this.purchaseOrderDetailRepository.save(detail);
      return detail.id;
    }
  }
  async findPurchaseOrderStatus(purchase_order_id: number) {
    const data = await this.purchaseOrderStatusRepository.find({
      where: {
        purchase_order_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        purchase_order_id: true,
        status_desc: true,
        status: true,
        reason: true,
        updated_at: true,
        updated_by: true,
        users: {
          id: true,
          full_name: true,
        },
      },
      relations: { users: true },
      order: { id: 'asc' },
    });
    return data;
  }
  async updateToProject(
    purchase_order_id: number,
    status: StatusPurchaseOrderEnum,
  ) {
    // const arrRelationsIds = [];
    const arrPurchaseDetailIds = [];
    const purchaseOrder = await this.findOne(purchase_order_id);
    if (!purchaseOrder) {
      return false;
    }
    const detail = await this.purchaseOrderDetailRepository.find({
      where: {
        purchase_order_id,
      },
    });
    if (detail.length < 1) {
      return false;
    }
    // detail.map((v) => arrRelationsIds.push(v.relation_id));
    detail.map((v) => arrPurchaseDetailIds.push(v.id));
    if (purchaseOrder.type === PurchaseOrderTypeEnum.Material) {
      this.projectVendorMaterialDetailRepository.update(
        {
          purchase_order_detail_id: In(arrPurchaseDetailIds),
        },
        { status_purchase_order: status },
      );
    } else if (purchaseOrder.type === PurchaseOrderTypeEnum.Production) {
      this.projectVendorProductionDetailRepository.update(
        {
          purchase_order_detail_id: In(arrPurchaseDetailIds),
        },
        { status_purchase_order: status },
      );
    }
  }

  async cancelPurchaseOrderApproval(
    purchase_order_id: number,
    status_id: number,
    user_id: number,
  ) {
    let updateToProject: any;
    const status = await this.purchaseOrderStatusRepository.findOne({
      where: { id: status_id, purchase_order_id },
    });
    if (!status) {
      throw new AppErrorNotFoundException();
    }
    status.updated_at = null;
    status.updated_by = null;
    status.status = null;
    status.reason = null;
    await this.purchaseOrderStatusRepository.save(status);
    if (status.status_desc === PurchaseOrderStatusEnum.PaymentStatusConfirm) {
      updateToProject = await this.updateToProject(
        purchase_order_id,
        StatusPurchaseOrderEnum.Waiting,
      );
    }
    return { status, updateToProject };
  }
}
