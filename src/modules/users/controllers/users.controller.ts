import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../../utils/pagination';
import { GetUserListDto } from '../dto/get-user-list.dto';
import { UsersWorkspaceService } from '../services/users-workspace.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersWorkspaceService: UsersWorkspaceService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: GetUserListDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.usersService.findUserList({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      keyword: query.keyword,
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

  @Post('sync')
  async syncUsersWorkspace() {
    const arrUsersWorkspace =
      await this.usersWorkspaceService.findUsersWorkspace();
    const syncData = await this.usersWorkspaceService.syncData(
      arrUsersWorkspace,
    );
    return { message: 'Successfully please refetch users', data: syncData };
  }
}
