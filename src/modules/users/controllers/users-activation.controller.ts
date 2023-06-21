import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UsersActivationService } from '../services/users-activation.service';
import { UserActivationDto } from '../dto/user-activation.dto';

@ApiBearerAuth()
@ApiTags('Users Management')
@UseGuards(JwtAuthGuard)
@Controller('users/activation')
export class UsersActivationController {
  constructor(
    private readonly usersActivationService: UsersActivationService,
  ) {}

  @Post()
  async create(
    @Req() req,
    @Body() userActivationDto: UserActivationDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersActivationService.activeNewPassword(
      userActivationDto,
      req.user.id,
      i18n,
    );
    return { message: i18n.t('users.success_create'), data };
  }
}
