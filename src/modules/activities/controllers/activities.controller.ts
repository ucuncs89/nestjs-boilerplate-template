import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ActivitiesService } from '../services/activities.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetListActivitiesDto } from '../dto/get-list-activity.dto';
import { Pagination } from 'src/utils/pagination';

@ApiBearerAuth()
@ApiTags('Activities')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createActivityDto: CreateActivityDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.activitiesService.create(
      createActivityDto,
      req.user.id,
      i18n,
    );
    return { data, message: 'Successfully' };
  }

  @Get()
  async findAll(@Query() query: GetListActivitiesDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.activitiesService.findAll({
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
      `/actvities`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.activitiesService.findOne(+id, i18n);
    return { data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.activitiesService.update(
      +id,
      updateActivityDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.activitiesService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
