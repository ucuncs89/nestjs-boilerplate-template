import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { VendorsService } from '../services/vendors.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetListVendorsDto } from '../dto/get-list-vendor.dto';
import { Pagination } from 'src/utils/pagination';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { Role } from 'src/modules/roles/enum/role.enum';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { ValidationVendorDto } from '../dto/validation-vendor.dto';

@ApiBearerAuth()
@ApiTags('vendors')
@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createVendorDto: CreateVendorDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.vendorsService.create(
      createVendorDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get()
  async findAll(@Query() query: GetListVendorsDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.vendorsService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      status: query.status,
      taxable: query.taxable,
      keyword: query.keyword,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/vendors`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.vendorsService.findOne(+id);
    return { data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    const data = await this.vendorsService.update(
      +id,
      updateVendorDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.vendorsService.remove(+id, req.user.id);
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.FINANCE)
  @Put(':id/validation')
  async validateCustomer(
    @Req() req,
    @Param('id') id: string,
    @Body() validationVendorDto: ValidationVendorDto,
  ) {
    const data = await this.vendorsService.validateVendor(
      +id,
      validationVendorDto,
      req.user.id,
    );
    return { data };
  }
}
