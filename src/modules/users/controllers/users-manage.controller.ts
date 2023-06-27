import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { Role } from 'src/modules/roles/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { GetUserListDto } from '../dto/get-user-list.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserActivationByAdminDto } from '../dto/activation-user-by-admin.dto';

@ApiBearerAuth()
@ApiTags('Users Management')
@HasRoles(Role.SUPERADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users/manage')
export class UsersManageController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createUserDto: CreateUserDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersService.createUser(
      createUserDto,
      req.user.id,
      i18n,
    );
    return { message: i18n.t('users.success_create'), data };
  }

  @Get()
  async findAll(@Query() query: GetUserListDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.usersService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      keywoard: query.keyword,
      roles: query.roles,
      order_by: query.order_by || 'DESC',
      sort_by: query.sort_by || 'created_at',
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `users`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.usersService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, i18n: I18nContext) {
    const data = await this.usersService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersService.update(
      {
        id,
        ...updateUserDto,
        user_id: req.user.id,
      },
      i18n,
    );
    return { message: 'Successfully', data };
  }
  @Put(':id/activation')
  async updateActivationByAdmin(
    @Req() req,
    @Param('id') id: number,
    @Body() payload: UserActivationByAdminDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersService.activationByAdmin(
      {
        id,
        ...payload,
        user_id: req.user.id,
      },
      i18n,
    );
    return { message: 'Successfully', data };
  }
}
