import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { DepartmentsService } from '../services/departments.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { Role } from 'src/modules/roles/enum/role.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListDepartmentDto } from '../dto/get-list-department.dto';
import { Pagination } from 'src/utils/pagination';

@ApiBearerAuth()
@ApiTags('Departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createDepartmentDto: CreateDepartmentDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.departmentsService.create(
      createDepartmentDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListDepartmentDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.departmentsService.findAll({
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
      `/departments`,
    );
    return { message: 'Successfully', ...data, pagination };
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.departmentsService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.departmentsService.update(
      +id,
      updateDepartmentDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.departmentsService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
