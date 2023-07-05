import {
  Body,
  Controller,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO } from '../dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { OtpVerificationDto } from '../dto/otp-verification.dto.';
import { OtpRequestDto } from '../dto/otp-request.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { PutForgotPassword } from '../dto/put-forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ChangePasswordDto } from '../dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

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

  @Put('password')
  async resetPassword(
    @Query('token') token: string,
    @Body()
    payload: PutForgotPassword,
    @I18n() i18n: I18nContext,
  ) {
    if (!token) {
      throw new AppErrorException(
        await i18n.t('auth.token_is_required'),
        'token_is_required',
      );
    }
    const verifToken = this.jwtService.verify(token);
    const data = await this.authService.putResetPassword(
      {
        user: verifToken,
        ...payload,
      },
      i18n,
    );
    return {
      message: i18n.t('auth.reset_password_success'),
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout Successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req,
    @I18n() i18n: I18nContext,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(
      changePasswordDto,
      req.user.id,
      i18n,
    );
    return { message: i18n.t('auth.password_change_success'), data };
  }
}
