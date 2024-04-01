import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  Put,
  Body,
  Post,
} from '@nestjs/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetListPurchaseOrderDto } from '../dto/get-list-purchase-order.dto';
import { Pagination } from 'src/utils/pagination';
import {
  PurchaseApprovalDto,
  PurchaseOrderDto,
  PurchaseOrderStatusPaymentDto,
  PurchaseOrderStatusReceiveDto,
} from '../dto/purchase-order.dto';

@ApiBearerAuth()
@ApiTags('Purchase Order')
@UseGuards(JwtAuthGuard)
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  async findAll(@Query() query: GetListPurchaseOrderDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.purchaseOrderService.findAll({
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
      `/purchase-order`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.purchaseOrderService.findOne(id);
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.purchaseOrderService.remove(+id, req.user.id);
    return { data };
  }

  @Get(':id/detail')
  async findDetailPurchase(@Param('id') id: number) {
    const company = {
      name: 'Cloami',
      address: 'Jl. Manglid No. 21A / 41A, Bandung',
      phone_number: '0852 2010 0885',
    };
    const detail = await this.purchaseOrderService.findDetail(id);

    return { message: 'Successfully', data: { ...detail, company } };
  }
  @Put(':id')
  async putPurchaseOrder(
    @Req() req,
    @Param('id') id: number,
    @Body() purchaseOrderDto: PurchaseOrderDto,
  ) {
    const data = await this.purchaseOrderService.updatePurchaseOrder(
      id,
      purchaseOrderDto,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }

  @Post(':id/approval/:approval_id')
  async updateApproval(
    @Req() req,
    @Param('id') id: number,
    @Param('approval_id') approval_id: number,
    @Body() purchaseApprovalDto: PurchaseApprovalDto,
  ) {
    const data = await this.purchaseOrderService.updatePurchaseOrderApproval(
      id,
      approval_id,
      purchaseApprovalDto,
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
    const data = await this.purchaseOrderService.cancelPurchaseOrderApproval(
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
    @Body() purchaseOrderStatusPaymentDto: PurchaseOrderStatusPaymentDto,
  ) {
    const data = await this.purchaseOrderService.updateStatusPayment(
      id,
      purchaseOrderStatusPaymentDto,
      req.user.id,
    );
    return { data };
  }
  @Post(':id/receive_status')
  async updateReceiveStatus(
    @Req() req,
    @Param('id') id: number,
    @Body() purchaseOrderStatusReceiveDto: PurchaseOrderStatusReceiveDto,
  ) {
    const data = await this.purchaseOrderService.updateStatusReceive(
      id,
      purchaseOrderStatusReceiveDto,
      req.user.id,
    );
    return { data };
  }
}
