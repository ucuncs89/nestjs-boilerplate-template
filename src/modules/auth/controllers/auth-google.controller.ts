import { Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGoogleService } from '../services/auth-google.service';
import { AuthGoogleDTO } from '../dto/auth-google.dto';
import { OAuth2Client } from 'google-auth-library';
import { AppErrorException } from '../../../exceptions/app-exception';
import { UsersService } from 'src/modules/users/services/users.service';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_SSO_CLIENT_ID,
  process.env.GOOGLE_SSO_CLIENT_SECRET,
);

@ApiTags('auth')
@Controller('auth/google')
@ApiBearerAuth()
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly usersServices: UsersService,
  ) {}

  @Post()
  async login(
    @Query() authGoogleDTO: AuthGoogleDTO,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const dataGoogle = await googleClient.verifyIdToken({
        idToken: authGoogleDTO.google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const googlePayload = dataGoogle.getPayload();

      if (!googlePayload.email_verified) {
        throw new AppErrorException(
          i18n.t('auth.google_auth_email_not_verified'),
          'GOOGLE_AUTH_EMAIL_NOT_VERIFIED',
        );
      }
      const findUser = await this.usersServices.findUserByEmail(
        googlePayload.email,
      );
      if (!findUser) {
        const data = await this.authGoogleService.createGoogleAccount(
          googlePayload,
        );
        return { message: i18n.t('auth.login_success'), data };
      }

      const data = await this.authGoogleService.googleLogin(
        googlePayload.email,
        i18n,
      );
      return {
        message: i18n.t('auth.login_success'),
        data,
      };
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }
}
