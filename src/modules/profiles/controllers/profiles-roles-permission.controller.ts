import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProfileRolesPermissionService } from '../services/profiles-roles-permission.service';

@ApiBearerAuth()
@ApiTags('Profiles Role Permission')
@UseGuards(JwtAuthGuard)
@Controller('profile/role/permission')
export class ProfilesRolesPermissionController {
  constructor(
    private readonly profileRolesPermissionService: ProfileRolesPermissionService,
  ) {}

  @Get()
  async findAll(@Req() req, @I18n() i18n: I18nContext) {
    const data = await this.profileRolesPermissionService.findAll(
      req.user.roles,
    );

    return { message: 'Successfully', data };
  }
  @Get(':id')
  async findDetail(
    @Req() req,
    @Param('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.profileRolesPermissionService.findAllPermissionById(
      id,
      req.user.roles,
    );

    return { message: 'Successfully', data };
  }
}
