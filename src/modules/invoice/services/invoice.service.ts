import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(ProjectInvoiceEntity)
    private projectInvoiceRepository: Repository<ProjectInvoiceEntity>,

    @InjectRepository(ProjectVendorMaterialFabricDetailEntity)
    private projectVendorMaterialFabricDetailRepository: Repository<ProjectVendorMaterialFabricDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingDetailEntity)
    private projectVendorMaterialAccessoriesSewingDetailRepository: Repository<ProjectVendorMaterialAccessoriesSewingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingDetailEntity)
    private projectVendorMaterialAccessoriesPackagingDetailRepository: Repository<ProjectVendorMaterialAccessoriesPackagingDetailEntity>,

    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    @InjectRepository(ProjectVendorMaterialFinishedGoodDetailEntity)
    private projectVendorMaterialFinishedGoodDetailRepository: Repository<ProjectVendorMaterialFinishedGoodDetailEntity>,
  ) {}

  async findAll(query: GetListInvoiceDto) {
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
    const [data, total] = await this.invoiceRepository.findAndCount({
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
    const data = await this.invoiceRepository.findOne({
      where: { id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async remove(id: number, user_id) {
    const data = await this.invoiceRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }

  async findDetail(id: number) {
    const invoice = await this.findOne(id);
    const projectInvoice = await this.projectInvoiceRepository.findOne({
      where: {
        invoice_id: id,
      },
    });
    const materialFabric = await this.findCostDetailsMaterialFabric(
      projectInvoice.project_detail_id,
    );

    const materialSewing = await this.findCostDetailsMaterialSewing(
      projectInvoice.project_detail_id,
    );

    const materialPackaging = await this.findCostDetailsMaterialPackaging(
      projectInvoice.project_detail_id,
    );

    const materialFinishedGood = await this.findCostDetailsMaterialFinishedGood(
      projectInvoice.project_detail_id,
    );

    const vendorProduction = await this.findCostDetailsProduction(
      projectInvoice.project_detail_id,
    );
    const arrItem = [
      ...materialFabric,
      ...materialSewing,
      ...materialPackaging,
      ...materialFinishedGood,
      ...vendorProduction,
    ];

    const subGrandTotal = arrItem.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.total_price;
    }, 0);
    const pph_result = (invoice.pph * subGrandTotal) / 100;
    const ppn_result = (invoice.ppn * subGrandTotal) / 100;
    const resultGrandTotal =
      subGrandTotal + pph_result + ppn_result - invoice.discount;
    return {
      ...invoice,
      cost_details: arrItem,
      pph_result,
      ppn_result,
      total: subGrandTotal,
      grand_total: resultGrandTotal,
    };
  }
  async findCostDetailsMaterialFabric(project_detail_id: number) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialFabricDetailRepository.find({
        where: {
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
    if (vendorMaterialDetail.length < 1) {
      return [];
    }
    for (const data of vendorMaterialDetail) {
      const description = data.vendor_material_fabric.project_fabric.name;
      const variant = data.vendor_material_fabric.project_variant.name;
      const arrVariantSize = [];
      for (const variant of data.vendor_material_fabric.project_variant.size) {
        arrVariantSize.push(`${variant.size_ratio}=${variant.number_of_item}`);
      }
      arrResult.push({
        id: data.id,
        description: `Fabric - ${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }
  async findCostDetailsMaterialSewing(project_detail_id: number) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialAccessoriesSewingDetailRepository.find({
        where: {
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
    if (vendorMaterialDetail.length < 1) {
      return [];
    }
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
        description: `Sewing - ${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }

  async findCostDetailsMaterialPackaging(project_detail_id: number) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialAccessoriesPackagingDetailRepository.find(
        {
          where: {
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
    if (vendorMaterialDetail.length < 1) {
      return [];
    }
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
        description: `Packaging - ${description}/${variant}(${arrVariantSize})`,
        price: data.price,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.total_price,
      });
    }
    return arrResult;
  }
  async findCostDetailsMaterialFinishedGood(project_detail_id: number) {
    const arrResult = [];
    const vendorMaterialDetail =
      await this.projectVendorMaterialFinishedGoodDetailRepository.find({
        where: {
          vendor_material_finished_good: {
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
          vendor_material_finished_good: {
            project_variant: {
              size: true,
              project_fabric: true,
            },
          },
        },
      });
    if (vendorMaterialDetail.length < 1) {
      return [];
    }
    for (const data of vendorMaterialDetail) {
      const description = 'Finished Goods';
      const variant = data.vendor_material_finished_good.project_variant.name;
      const arrVariantSize = [];
      for (const variant of data.vendor_material_finished_good.project_variant
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
  async findCostDetailsProduction(project_detail_id: number) {
    const arrResult = [];
    const vendorProductionDetail =
      await this.projectVendorProductionDetailRepository.find({
        where: {
          vendor_production: {
            project_detail_id,
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
    if (vendorProductionDetail.length < 1) {
      return [];
    }
    for (const data of vendorProductionDetail) {
      const description = data.vendor_production.activity_name;
      arrResult.push({
        id: data.id,
        description: `${description} - ${data.vendor_name}`,
        price: data.price / data.quantity,
        unit: data.quantity_unit,
        quantity: data.quantity,
        total_price: data.price,
      });
    }
    return arrResult;
  }
}
