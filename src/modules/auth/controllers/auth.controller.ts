import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO } from '../dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { OtpVerificationDto } from '../dto/otp-verification.dto.';
import { OtpRequestDto } from '../dto/otp-request.dto';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDTO: LoginUserDTO,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const data = await this.authService.login(loginUserDTO, i18n);
    return { message: i18n.t('auth.login_success'), data };
  }
  @Post('forgot-password')
  async postFogotPassword(@Query('email') email: string) {
    const data = await this.authService.forgotPassword(email);
    return { message: 'Successfully', data };
  }
  @Post('otp-request')
  async otpRequestByEmail(
    @Query() query: OtpRequestDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.authService.otpRequest(query, i18n);
    return { message: i18n.t('auth.otp_send'), data };
  }
  @Post('otp-verification')
  async otpVerificationByEmail(
    @Body() payload: OtpVerificationDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.authService.otpVerification(payload, i18n);
    return { message: i18n.t('auth.otp_verification'), data };
  }
}
