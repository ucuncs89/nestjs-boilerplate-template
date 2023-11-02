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
import { AccessoriesPackagingService } from '../services/accessories-packaging.service';
import { CreateAccessoryPackagingDto } from '../dto/create-accessory-packaging.dto';
import { UpdateAccessoryPackagingDto } from '../dto/update-accessory-packaging.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { Role } from 'src/modules/roles/enum/role.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { GetListAccessoriesPackagingDto } from '../dto/get-list-accessories-packaging.dto';

@ApiTags('Accessories Packaging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT, Role.PROJECT_MANAGEMENT)
@Controller('accessories/packaging')
export class AccessoriesPackagingController {
  constructor(
    private readonly accessoriesPackagingService: AccessoriesPackagingService,
  ) {}

  @Post()
  async create(
    @Req() req,
    @Body() createAccessoryPackagingDto: CreateAccessoryPackagingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.accessoriesPackagingService.create(
      createAccessoryPackagingDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListAccessoriesPackagingDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.accessoriesPackagingService.findAll({
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
      `/accessories/packaging`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.accessoriesPackagingService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAccessoryPackagingDto: UpdateAccessoryPackagingDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.accessoriesPackagingService.update(
      +id,
      updateAccessoryPackagingDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.accessoriesPackagingService.remove(
      +id,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }
}
