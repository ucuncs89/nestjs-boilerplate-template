import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/utils/pagination';
import { CostService } from '../services/cost.service';
import { GetListCostDto } from '../dto/get-list-cost.dto';

@ApiTags('Master Data')
@ApiBearerAuth()
@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Get()
  async findAll(@Query() query: GetListCostDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.costService.findAll({
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
      `/cost`,
    );
    return { message: 'Successfully', ...data, pagination };
  }
}
