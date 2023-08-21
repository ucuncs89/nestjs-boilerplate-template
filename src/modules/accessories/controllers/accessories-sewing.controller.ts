import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { Role } from 'src/modules/roles/enum/role.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { AccessoriesSewingService } from '../services/accessories-sewing.service';
import { CreateAccessorySewingDto } from '../dto/create-accessory-sewing.dto';
import { GetListAccessoriesSewingDto } from '../dto/get-list-accessories-sewing.dto';
import { UpdateAccessorySewingDto } from '../dto/update-accessory-sewing.dto';

@ApiTags('Accessories Sewing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('accessories/sewing')
export class AccessoriesSewingController {
  constructor(
    private readonly accessoriesSewingService: AccessoriesSewingService,
  ) {}

  @Post()
  async create(
    @Req() req,
    @Body() createAccessorySewingDto: CreateAccessorySewingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.accessoriesSewingService.create(
      createAccessorySewingDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListAccessoriesSewingDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.accessoriesSewingService.findAll({
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
      `/accessories/sewing`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.accessoriesSewingService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAccessorySewingDto: UpdateAccessorySewingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.accessoriesSewingService.update(
      +id,
      updateAccessorySewingDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.accessoriesSewingService.remove(
      +id,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }
}
