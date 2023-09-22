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
import { JwtAuthGuard } from '../../../modules/auth/jwt-auth.guard';
import { GetListVendorsDto } from '../dto/get-list-vendor.dto';
import { Pagination } from '../../../utils/pagination';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RolesGuard } from '../../../modules/roles/roles.guard';
import { Role } from '../../../modules/roles/enum/role.enum';
import { HasRoles } from '../../../modules/roles/has-roles.decorator';
import { ValidationVendorDto } from '../dto/validation-vendor.dto';
import { ActivationVendorDto } from '../dto/activation-vendor.dto';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';

@ApiBearerAuth()
@ApiTags('vendors')
@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

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
    this.rabbitMQService.send('send-notification-vendor-new', {
      from_user_id: req.user.id,
      from_user_fullname: req.user.full_name,
      message: `${req.user.full_name} added a new vendor named "${data.company_name}"`,
    });
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
      type: query.type,
      is_active: query.is_active,
      province_id: query.province_id,
      city_id: query.city_id,
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
    if (data.status === 'Validated') {
      this.rabbitMQService.send('send-notification-vendor-validation', {
        from_user_id: req.user.id,
        from_user_fullname: req.user.full_name,
        message: `${req.user.full_name} has validated vendor"${data.company_name}"`,
      });
    } else {
      this.rabbitMQService.send('send-notification-vendor-cancel-validation', {
        from_user_id: req.user.id,
        from_user_fullname: req.user.full_name,
        message: `${req.user.full_name} has canceled the vendor validation of "${data.company_name}"`,
      });
    }
    return { data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
  @Put(':id/activation')
  async activaition(
    @Req() req,
    @Param('id') id: string,
    @Body() activationVendorDto: ActivationVendorDto,
  ) {
    const data = await this.vendorsService.activationVendor(
      +id,
      activationVendorDto,
      req.user.id,
    );
    if (data.status === true) {
      this.rabbitMQService.send('send-notification-vendor-activation', {
        from_user_id: req.user.id,
        from_user_fullname: req.user.full_name,
        message: `${req.user.full_name} has changed the vendor status of "${data.company_name} to active"`,
      });
    } else {
      this.rabbitMQService.send('send-notification-vendor-cancel-activation', {
        from_user_id: req.user.id,
        from_user_fullname: req.user.full_name,
        message: `${req.user.full_name} has changed the vendor status of "${data.company_name} to inactive"`,
      });
    }
    return { data };
  }
}
