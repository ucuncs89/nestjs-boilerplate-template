import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomersService } from '../services/customers.service';
import { Pagination } from '../../../utils/pagination';
import { GetListCustomersDto } from '../dto/get-list-custmer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../../modules/roles/enum/role.enum';
import { JwtAuthGuard } from '../../../modules/auth/jwt-auth.guard';
import { RolesGuard } from '../../../modules/roles/roles.guard';
import { HasRoles } from '../../../modules/roles/has-roles.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ValidationCustomerDto } from '../dto/validation-customer.dto';
import { ActivationCustomerDto } from '../dto/activation-customer.dto';

@ApiBearerAuth()
@ApiTags('customers')
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createCustomerDto: CreateCustomerDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.customersService.create(
      createCustomerDto,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get()
  async findAll(@Query() query: GetListCustomersDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.customersService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      status: query.status,
      taxable: query.taxable,
      keyword: query.keyword,
      is_active: query.is_active,
      province_id: query.province_id,
      city_id: query.city_id,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/customers`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.customersService.findOne(+id);
    return { data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const data = await this.customersService.update(
      +id,
      updateCustomerDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.customersService.remove(+id, req.user.id);
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.FINANCE)
  @Put(':id/validation')
  async validateCustomer(
    @Req() req,
    @Param('id') id: string,
    @Body() validationCustomerDto: ValidationCustomerDto,
  ) {
    const data = await this.customersService.validateCustomer(
      +id,
      validationCustomerDto,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
  @Put(':id/activation')
  async activaition(
    @Req() req,
    @Param('id') id: string,
    @Body() activationCustomerDto: ActivationCustomerDto,
  ) {
    const data = await this.customersService.activationCustomer(
      +id,
      activationCustomerDto,
      req.user.id,
    );
    return { data };
  }
}
