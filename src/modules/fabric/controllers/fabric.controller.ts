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
import { FabricService } from '../services/fabric.service';
import { CreateFabricDto } from '../dto/create-fabric.dto';
import { UpdateFabricDto } from '../dto/update-fabric.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { Role } from 'src/modules/roles/enum/role.enum';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListFabricDto } from '../dto/get-list-fabric.dto';
import { Pagination } from 'src/utils/pagination';

@ApiTags('Fabric')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('fabric')
export class FabricController {
  constructor(private readonly fabricService: FabricService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createFabricDto: CreateFabricDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricService.create(
      createFabricDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListFabricDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.fabricService.findAll({
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
    const data = await this.fabricService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateFabricDto: UpdateFabricDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.fabricService.update(
      +id,
      updateFabricDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.fabricService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
