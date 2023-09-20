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
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { Role } from 'src/modules/roles/enum/role.enum';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { GetListCategoryDto } from '../dto/get-list-category.dto';
import { Pagination } from 'src/utils/pagination';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.categoryService.create(
      createCategoryDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListCategoryDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.categoryService.findAll({
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
      `/category`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.categoryService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.categoryService.update(
      +id,
      updateCategoryDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.categoryService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }
}
