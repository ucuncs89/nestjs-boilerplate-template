import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
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
}
