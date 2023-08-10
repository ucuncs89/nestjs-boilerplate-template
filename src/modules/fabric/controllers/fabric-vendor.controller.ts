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
import { Role } from 'src/modules/roles/enum/role.enum';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListFabricDto } from '../dto/get-list-fabric.dto';
import { Pagination } from 'src/utils/pagination';
import { FabricVendorService } from '../services/fabric-vendor.service';
import { CreateFabricVendorDto } from '../dto/create-fabric-vendor.dto';
import { UpdateFabricDto } from '../dto/update-fabric.dto';
import { UpdateFabricVendorDto } from '../dto/update-fabric-vendor.dto';

@ApiTags('Fabric Vendor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('fabric')
export class FabricVendorController {
  constructor(private readonly fabricVendorService: FabricVendorService) {}

  @Post(':fabric_number/fabric_vendor')
  async create(
    @Req() req,
    @Param('fabric_number') fabric_id: number,
    @Body() createFabricVendorDto: CreateFabricVendorDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricVendorService.create(
      fabric_id,
      createFabricVendorDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get(':fabric_id/fabric_vendor')
  async findAll(
    @Param('fabric_id') fabric_id: number,
    @Query() query: GetListFabricDto,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.fabricVendorService.findAll({
      fabric_id,
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
      `/fabric/${fabric_id}/fabric_vendor`,
    );
    return { message: 'Successfully', ...data, pagination };
  }
  @Get(':fabric_id/fabric_vendor/:fabric_vendor_id')
  async findOne(
    @Param('fabric_id') fabric_id: number,
    @Param('fabric_vendor_id') fabric_vendor_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricVendorService.findOne(
      fabric_id,
      fabric_vendor_id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Put(':fabric_id/fabric_vendor/:fabric_vendor_id')
  async update(
    @Req() req,
    @Param('fabric_id') fabric_id: number,
    @Param('fabric_vendor_id') fabric_vendor_id: number,
    @Body() updateFabricVendorDto: UpdateFabricVendorDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricVendorService.update(
      fabric_id,
      fabric_vendor_id,
      updateFabricVendorDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':fabric_id/fabric_vendor/:fabric_vendor_id')
  async remove(
    @Req() req,
    @Param('fabric_id') fabric_id: number,
    @Param('fabric_vendor_id') fabric_vendor_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricVendorService.remove(
      fabric_id,
      fabric_vendor_id,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }
}
