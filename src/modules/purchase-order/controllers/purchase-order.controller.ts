import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetListPurchaseOrderDto } from '../dto/get-list-purchase-order.dto';
import { Pagination } from 'src/utils/pagination';

@ApiBearerAuth()
@ApiTags('Purchase Order')
@UseGuards(JwtAuthGuard)
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  // @Post()
  // create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
  //   return this.purchaseOrderService.create(createPurchaseOrderDto);
  // }
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
      `/project`,
    );
    return { message: 'Successfully', ...data, pagination };
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.purchaseOrderService.findOne(id);
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.purchaseOrderService.remove(+id, req.user.id);
  }
}
