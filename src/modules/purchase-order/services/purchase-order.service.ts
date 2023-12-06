import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from '../dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListPurchaseOrderDto } from '../dto/get-list-purchase-order.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import {
  PurchaseOrderDto,
  StatusApprovalEnum,
} from '../dto/purchase-order.dto';
import { PurchaseOrderApprovalEntity } from 'src/entities/purchase-order/purchase_order_approval.entity';
import { error } from 'console';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepository: Repository<PurchaseOrderEntity>,

    @InjectRepository(ProjectPurchaseOrderEntity)
    private projectPurchaseOrderRepository: Repository<ProjectPurchaseOrderEntity>,

    @InjectRepository(ProjectVendorMaterialFabricDetailEntity)
    private projectVendorMaterialFabricDetailRepository: Repository<ProjectVendorMaterialFabricDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingDetailEntity)
    private projectVendorMaterialAccessoriesSewingDetailRepository: Repository<ProjectVendorMaterialAccessoriesSewingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingDetailEntity)
    private projectVendorMaterialAccessoriesPackagingDetailRepository: Repository<ProjectVendorMaterialAccessoriesPackagingDetailEntity>,

    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailEntityRepository: Repository<ProjectVendorProductionDetailEntity>,

    @InjectRepository(PurchaseOrderApprovalEntity)
    private purchaseOrderApprovalRepository: Repository<PurchaseOrderApprovalEntity>,
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
        approval: {
          id: true,
          status: true,
          status_desc: true,
          purchase_order_id: true,
        },
      },
      relations: {
        approval: true,
      },
      order: {
        approval: { id: 'ASC' },
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
    const projectPurchaseOrder =
      await this.projectPurchaseOrderRepository.findOne({
        where: {
          purchase_order_id: id,
        },
      });
    let costDetails = [];
    if (projectPurchaseOrder.vendor_type === 'Material') {
      if (projectPurchaseOrder.material_type === 'Fabric') {
        costDetails = await this.findCostDetailsMaterialFabric(
          projectPurchaseOrder.project_detail_id,
          purchaseOrder.vendor_id,
        );
      }
      if (projectPurchaseOrder.material_type === 'Sewing') {
        costDetails = await this.findCostDetailsMaterialSewing(
          projectPurchaseOrder.project_detail_id,
          purchaseOrder.vendor_id,
        );
      }
      if (projectPurchaseOrder.material_type === 'Packaging') {
        costDetails = await this.findCostDetailsMaterialPackaging(
          projectPurchaseOrder.project_detail_id,
          purchaseOrder.vendor_id,
        );
      }
    } else if (projectPurchaseOrder.vendor_type === 'Production') {
      costDetails = await this.findCostDetailsProduction(
        projectPurchaseOrder.project_detail_id,
        purchaseOrder.vendor_id,
        projectPurchaseOrder.material_type,
      );
    }
    const subGrandTotal = costDetails.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.total_price;
    }, 0);
    const pph_result = (purchaseOrder.pph * subGrandTotal) / 100;
    const ppn_result = (purchaseOrder.ppn * subGrandTotal) / 100;
    const resultGrandTotal =
      subGrandTotal + pph_result + ppn_result - purchaseOrder.discount;
    return {
      ...purchaseOrder,
      cost_details: costDetails,
      pph_result,
      ppn_result,
      total: subGrandTotal,
      grand_total: resultGrandTotal,
    };
  }
  async findCostDetailsMaterialFabric(
    project_detail_id: number,
    vendor_id: number,
  ) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialFabricDetailRepository.find({
        where: {
          vendor_id,
          vendor_material_fabric: {
            project_detail_id,
          },
        },
        select: {
          id: true,
          vendor_id: true,
          price: true,
          price_unit: true,
          quantity: true,
          quantity_unit: true,
          total_price: true,
          vendors: {
            id: true,
            company_name: true,
          },
        },
        relations: {
          vendor_material_fabric: {
            project_fabric: true,
            project_variant: {
              size: true,
              project_fabric: true,
            },
          },
        },
      });
    for (const data of vendorMaterialDetail) {
      const description = data.vendor_material_fabric.project_fabric.name;
      const variant = data.vendor_material_fabric.project_variant.name;
      const arrVariantSize = [];
      for (const variant of data.vendor_material_fabric.project_variant.size) {
        arrVariantSize.push(`${variant.size_ratio}=${variant.number_of_item}`);
      }
      arrResult.push({
        id: data.id,
        description: `${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }
  async findCostDetailsMaterialSewing(
    project_detail_id: number,
    vendor_id: number,
  ) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialAccessoriesSewingDetailRepository.find({
        where: {
          vendor_id,
          vendor_material_sewing: {
            project_detail_id,
          },
        },
        select: {
          id: true,
          vendor_id: true,
          price: true,
          price_unit: true,
          quantity: true,
          quantity_unit: true,
          total_price: true,
          vendors: {
            id: true,
            company_name: true,
          },
        },
        relations: {
          vendor_material_sewing: {
            project_accessories_sewing: true,
            project_variant: {
              size: true,
              project_fabric: true,
            },
          },
        },
      });
    for (const data of vendorMaterialDetail) {
      const description =
        data.vendor_material_sewing.project_accessories_sewing.name;
      const variant = data.vendor_material_sewing.project_variant.name;
      const arrVariantSize = [];
      for (const variant of data.vendor_material_sewing.project_variant.size) {
        arrVariantSize.push(`${variant.size_ratio}=${variant.number_of_item}`);
      }
      arrResult.push({
        id: data.id,
        description: `${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }

  async findCostDetailsMaterialPackaging(
    project_detail_id: number,
    vendor_id: number,
  ) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialAccessoriesPackagingDetailRepository.find(
        {
          where: {
            vendor_id,
            vendor_material_packaging: {
              project_detail_id,
            },
          },
          select: {
            id: true,
            vendor_id: true,
            price: true,
            price_unit: true,
            quantity: true,
            quantity_unit: true,
            total_price: true,
            vendors: {
              id: true,
              company_name: true,
            },
          },
          relations: {
            vendor_material_packaging: {
              project_accessories_packaging: true,
              project_variant: {
                size: true,
                project_fabric: true,
              },
            },
          },
        },
      );
    for (const data of vendorMaterialDetail) {
      const description =
        data.vendor_material_packaging.project_accessories_packaging.name;
      const variant = data.vendor_material_packaging.project_variant.name;
      const arrVariantSize = [];
      for (const variant of data.vendor_material_packaging.project_variant
        .size) {
        arrVariantSize.push(`${variant.size_ratio}=${variant.number_of_item}`);
      }
      arrResult.push({
        id: data.id,
        description: `${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }
  async findCostDetailsProduction(
    project_detail_id: number,
    vendor_id: number,
    type: string,
  ) {
    const arrResult = [];
    const vendorProductionDetail =
      await this.projectVendorProductionDetailEntityRepository.find({
        where: {
          vendor_id,
          vendor_production: {
            project_detail_id,
            activity_name: type,
          },
        },
        select: {
          id: true,
          quantity: true,
          quantity_unit: true,
          price: true,
          vendor_name: true,
        },
        relations: { vendor_production: true },
      });
    for (const data of vendorProductionDetail) {
      const description = data.vendor_production.activity_name;
      arrResult.push({
        id: data.id,
        description: `${description})`,
        price: data.price / data.quantity,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.price,
      });
    }
    return arrResult;
  }
  async updateGrandTotal(purchase_order_id) {
    const resultGrandTotal = await this.findDetail(purchase_order_id);
    try {
      return await this.purchaseOrderRepository.update(
        { id: purchase_order_id },
        {
          grand_total: resultGrandTotal.grand_total || null,
        },
      );
    } catch (error) {
      throw new AppErrorNotFoundException();
    }
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
      console.log(error);

      throw new AppErrorException(error);
    }
  }
  async updatePurchaseOrderApproval(
    purchase_order_id: number,
    approval_id: number,
    status: StatusApprovalEnum,
    user_id: number,
  ) {
    try {
      const data = await this.purchaseOrderApprovalRepository.update(
        {
          id: approval_id,
          purchase_order_id,
        },
        { status, updated_by: user_id, updated_at: new Date().toISOString() },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
