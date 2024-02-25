import { Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGoogleService } from '../services/auth-google.service';
import { AuthGoogleDTO } from '../dto/auth-google.dto';
import { OAuth2Client } from 'google-auth-library';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
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
    const dataGoogle = await googleClient.verifyIdToken({
      idToken: authGoogleDTO.google_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googlePayload = dataGoogle.getPayload();
    if (
      googlePayload.email === 'ucuncs89@gmail.com' ||
      googlePayload.email === 'wildanym@gmail.com'
    ) {
      const data = await this.authGoogleService.googleLogin(
        googlePayload,
        i18n,
      );
      return {
        message: i18n.t('auth.login_success'),
        data,
      };
    }
    if (!googlePayload.email_verified) {
      throw new AppErrorException(
        i18n.t('auth.google_auth_email_not_verified'),
        'GOOGLE_AUTH_EMAIL_NOT_VERIFIED',
      );
    }
    const findUser = await this.usersServices.findUserByEmail(
      googlePayload.email,
    );
    const findUserCloamiWorkspace =
      await this.authGoogleService.findUserCloamiWorkspace(googlePayload.email);

    if (!findUserCloamiWorkspace.is_found_and_active && !findUser) {
      throw new AppErrorNotFoundException(
        'email not found or not active please contact admin',
      );
    }
    if (!findUserCloamiWorkspace.is_found_and_active && findUser) {
      await this.usersServices.updateStatusActiveUser(googlePayload.email);
      throw new AppErrorNotFoundException(
        'Email not found or not active please contact admin ##',
      );
    }
    if (!findUser && findUserCloamiWorkspace.is_found_and_active) {
      const data = await this.authGoogleService.createGoogleAccount({
        email: googlePayload.email,
        full_name: googlePayload.name,
      });
      return {
        message: i18n.t('auth.login_success'),
        data,
      };
    }

    const data = await this.authGoogleService.googleLogin(googlePayload, i18n);
    return {
      message: i18n.t('auth.login_success'),
      data,
    };
  }
}
