import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { GetListProjectHistoryDto } from '../dto/get-list-project-history.dto';
import { ProjectHistoryService } from '../services/project_history.service';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectHistoryController {
  constructor(private readonly projectHistoryService: ProjectHistoryService) {}

  @Get(':id/history')
  async findAll(
    @Query() query: GetListProjectHistoryDto,
    @Param('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.projectHistoryService.findAll(
      {
        page: (_page - 1) * _page_size,
        page_size: _page_size,
        sort_by: query.sort_by || 'created_at',
        order_by: query.order_by || 'DESC',
      },
      id,
    );
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/project/${id}/history`,
    );
    return { message: 'Successfully', data, pagination };
  }
}
