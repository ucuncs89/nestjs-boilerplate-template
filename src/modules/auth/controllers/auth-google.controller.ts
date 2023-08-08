import { Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGoogleService } from '../services/auth-google.service';
import { AuthGoogleDTO } from '../dto/auth-google.dto';
import { OAuth2Client } from 'google-auth-library';
import { AppErrorException } from 'src/exceptions/app-exception';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_SSO_CLIENT_ID,
  process.env.GOOGLE_SSO_CLIENT_SECRET,
);

@ApiTags('auth')
@Controller('auth/google')
@ApiBearerAuth()
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

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
    if (!googlePayload.email_verified) {
      throw new AppErrorException(
        i18n.t('auth.google_auth_email_not_verified'),
        'GOOGLE_AUTH_EMAIL_NOT_VERIFIED',
      );
    }

    const data = await this.authGoogleService.googleLogin(googlePayload, i18n);
    return { message: i18n.t('auth.login_success'), data };
  }
}
