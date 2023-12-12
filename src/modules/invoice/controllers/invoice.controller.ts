import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';

import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import { Pagination } from 'src/utils/pagination';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // @Post()
  // create(@Body() createInvoiceDto: CreateInvoiceDto) {
  //   return this.invoiceService.create(createInvoiceDto);
  // }

  @Get()
  async findAll(@Query() query: GetListInvoiceDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.invoiceService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      keyword: query.keyword,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/invoice`,
    );
    return { message: 'Data nya belum fix', ...data, pagination };
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.invoiceService.findOne(id);
    return { message: 'Data nya belum fix', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.invoiceService.remove(+id, req.user.id);
    return { message: 'Data nya belum fix', data };
  }

  @Get(':id/detail')
  async findDetailPurchase(@Param('id') id: number) {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.invoiceService.findDetail(id);

    return {
      message: 'Successfully belum ambil dari refactor-project',
      data: { ...detail, company },
    };
  }
}
