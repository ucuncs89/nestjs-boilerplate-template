import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(ProjectInvoiceEntity)
    private projectInvoiceRepository: Repository<ProjectInvoiceEntity>,

    @InjectRepository(ProjectVariantEntity)
    private projectVariantRepository: Repository<ProjectVariantEntity>,

    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,

    @InjectRepository(ProjectDetailEntity)
    private projectDetailRepository: Repository<ProjectDetailEntity>,
  ) {}

  async findAll(query: GetListInvoiceDto) {
    const { page, page_size, sort_by, order_by, keyword } = query;
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
      relations: { project: true },
    });
    return {
      data,
      total_data: total,
    };
  }

  async findOne(id: number) {
    const data = await this.invoiceRepository.findOne({
      where: { id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_id: true,
        code: true,
        customer_id: true,
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
          invoice_id: true,
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
    const data = await this.invoiceRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }
  async findProjectInvoice(invoice_id: number) {
    return await this.projectInvoiceRepository.findOne({
      where: {
        invoice_id,
      },
    });
  }

  async findDetail(id: number) {
    const invoice = await this.findOne(id);
    const projectInvoice = await this.projectInvoiceRepository.findOne({
      where: {
        invoice_id: id,
      },
    });
    const projectDetailPlanning = await this.projectDetailRepository.findOne({
      select: { id: true, project_id: true },
      where: {
        project_id: invoice.project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Planning',
      },
    });
    const projectPrice = await this.projectPriceRepository.findOne({
      where: { project_detail_id: projectDetailPlanning.id },
      select: {
        id: true,
        project_detail_id: true,
        selling_price_per_item: true,
        loss_percentage: true,
      },
    });
    const selling_price_per_item = projectPrice
      ? projectPrice.selling_price_per_item
      : 0;
    const projectVariantSize = await this.findProjectVariantCalculate(
      projectInvoice.project_detail_id,
      selling_price_per_item,
    );

    const subGrandTotal = projectVariantSize.reduce(
      (accumulator, currentItem) => {
        return accumulator + currentItem.total_price;
      },
      0,
    );
    const pph_result = (invoice.pph * subGrandTotal) / 100;
    const ppn_result = (invoice.ppn * subGrandTotal) / 100;
    const resultGrandTotal =
      subGrandTotal + pph_result + ppn_result - invoice.discount;
    return {
      ...invoice,
      cost_details: projectVariantSize,
      pph_result,
      ppn_result,
      total: subGrandTotal,
      grand_total: resultGrandTotal,
      project_detail_id_production: projectInvoice.project_detail_id,
      project_detail_planning: projectDetailPlanning.id,
    };
  }

  async generateCodeInvoice() {
    const pad = '0000';
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    try {
      const packaging = await this.invoiceRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = packaging[0] ? `${packaging[0].id + 1}` : '1';
      return `INV-${formattedDate}-${
        pad.substring(0, pad.length - id.length) + id
      }`;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateGrandTotal(invoice_id: number) {
    const resultGrandTotal = await this.findDetail(invoice_id);
    try {
      return await this.invoiceRepository.update(
        { id: invoice_id },
        {
          grand_total: resultGrandTotal.grand_total || null,
        },
      );
    } catch (error) {
      throw new AppErrorNotFoundException();
    }
  }

  async findProjectVariantCalculate(project_detail_id: number, price: number) {
    const arrResult = [];
    const data = await this.projectVariantRepository.find({
      where: { project_detail_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_detail_id: true,
        name: true,
        total_item: true,
        item_unit: true,
        project_fabric: {
          id: true,
          project_variant_id: true,
          color_id: true,
          project_fabric_id: true,
          color_name: true,
          project_material_item: {
            id: true,
            name: true,
            consumption: true,
            consumption_unit: true,
            type: true,
            category: true,
          },
        },
      },
      relations: {
        size: true,
        project_fabric: { project_material_item: true },
      },
    });
    if (data.length < 1) {
      return [];
    }

    let no = 1;
    for (const variant of data) {
      const arrVariantSize = [];
      const arrVariantColorFabric = [];
      for (const size of variant.size) {
        arrVariantSize.push(`${size.size_ratio}=${size.number_of_item}`);
      }
      for (const fabric of variant.project_fabric) {
        arrVariantColorFabric.push(`${fabric.color_name}`);
      }
      arrResult.push({
        no: no++,
        description: `${variant.name} (${arrVariantColorFabric}) (${arrVariantSize})`,
        price,
        unit: 'PCS',
        quantity: variant.total_item,
        total_price: price * variant.total_item,
      });
    }
    return arrResult;
  }
}
