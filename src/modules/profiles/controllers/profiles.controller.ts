import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@ApiBearerAuth()
@ApiTags('Profiles')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getProfile(@Req() req, @I18n() i18n: I18nContext) {
    const data = await this.profilesService.findMe(req.user.id);
    return { message: 'Data Found', data };
  }
  @Get('roles')
  async getRolesProfile(@Req() req, @I18n() i18n: I18nContext) {
    const data = await this.profilesService.findMeRoles(req.user.roles);
    return { message: 'Successfully', data };
  }
  @Put()
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.profilesService.updateProfile(
      updateProfileDto,
      req.user.id,
      i18n,
    );
    return { message: i18n.t('profile.update_success'), data };
  }
}
