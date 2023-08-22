import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { CreateColorDto } from '../dto/create-color.dto';
import { UpdateColorDto } from '../dto/update-color.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListColorDto } from '../dto/get-list-color.dto';
import { Pagination } from 'src/utils/pagination';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { Role } from 'src/modules/roles/enum/role.enum';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';

@ApiTags('Color')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createColorDto: CreateColorDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.colorService.create(
      createColorDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListColorDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.colorService.findAll({
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
      `/color`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.colorService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.colorService.update(
      +id,
      updateColorDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.colorService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
