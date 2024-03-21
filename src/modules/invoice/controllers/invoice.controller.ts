import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';

import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import { Pagination } from 'src/utils/pagination';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  InvoiceApprovalDto,
  InvoiceDto,
  InvoiceStatusPaymentDto,
} from '../dto/invoice.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('invoice')
@ApiTags('invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
      start_date: query.start_date,
      end_date: query.end_date,
      type: query.type,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/invoice`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.invoiceService.findOne(id);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async editInvoice(
    @Req() req,
    @Body() invoiceDto: InvoiceDto,
    @Param('id') id: number,
  ) {
    const data = await this.invoiceService.updateInvoice(
      id,
      invoiceDto,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.invoiceService.remove(+id, req.user.id);
    return { message: 'Successfully', data };
  }

  @Get(':id/detail')
  async findDetailInvoice(@Param('id') id: number) {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.invoiceService.findDetail(id);

    return {
      data: { ...detail, company },
    };
  }

  @Post(':id/approval/:approval_id')
  async updateApproval(
    @Req() req,
    @Param('id') id: number,
    @Param('approval_id') approval_id: number,
    @Body() invoiceApprovalDto: InvoiceApprovalDto,
  ) {
    const data = await this.invoiceService.updateInvoiceApproval(
      id,
      approval_id,
      invoiceApprovalDto,
      req.user.id,
    );
    return { data };
  }
  @Post(':id/cancel/:approval_id')
  async cancelApproval(
    @Req() req,
    @Param('id') id: number,
    @Param('approval_id') approval_id: number,
  ) {
    const data = await this.invoiceService.cancelInvoiceApproval(
      id,
      approval_id,
      req.user.id,
    );
    return { data };
  }
  @Post(':id/payment_status')
  async updatePaymentStatus(
    @Req() req,
    @Param('id') id: number,
    @Body() invoiceStatusPaymentDto: InvoiceStatusPaymentDto,
  ) {
    const data = await this.invoiceService.updateStatusPayment(
      id,
      invoiceStatusPaymentDto,
      req.user.id,
    );
    return { data };
  }
}
