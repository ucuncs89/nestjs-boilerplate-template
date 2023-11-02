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
import { UnitService } from '../services/unit.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { GetListUnitDto } from '../dto/get-list-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';

@ApiTags('Master Data')
@ApiBearerAuth()
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT, Role.PROJECT_MANAGEMENT)
  @Post()
  async create(
    @Req() req,
    @Body() createUnitDto: CreateUnitDto[],
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.unitService.create(
      createUnitDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListUnitDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.unitService.findAll({
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
      `/unit`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.unitService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT, Role.PROJECT_MANAGEMENT)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.unitService.update(
      +id,
      updateUnitDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT, Role.PROJECT_MANAGEMENT)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.unitService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
