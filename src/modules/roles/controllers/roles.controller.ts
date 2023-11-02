import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../modules/auth/jwt-auth.guard';
import { Pagination } from '../../../utils/pagination';
import { CreateRoleDto } from '../dto/create-role.dto';
import { GetRolesListDto } from '../dto/get-roles-list.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../enum/role.enum';
import { HasRoles } from '../has-roles.decorator';
import { RolesGuard } from '../roles.guard';
import { RolesService } from '../services/roles.service';

@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
@HasRoles(Role.SUPERADMIN, Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Req() req, @Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto, req.user.id);
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Req() req, @Query() query: GetRolesListDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.rolesService.findAll(
      {
        page: (_page - 1) * _page_size,
        page_size: _page_size,
        search: query.search,
      },
      req.user.id,
    );
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `roles`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.rolesService.findOne(+id);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const data = await this.rolesService.update(
      +id,
      updateRoleDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const data = await this.rolesService.remove(+id, req.user.id);
    return { message: 'Successfully', data };
  }
}
