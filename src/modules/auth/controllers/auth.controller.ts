import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO) {
    const data = await this.authService.login(loginUserDTO);
    return { message: 'Login Successfully', data };
  }
  @Post('forgot-password')
  async postFogotPassword(@Query('email') email: string) {
    const data = await this.authService.forgotPassword(email);
    return { message: 'Successfully', data };
  }
  @Post('otp-request')
  async otpRequest(@Query('email') email: string) {
    // const data = await this.authService.otpRequest({ email });
    return { message: 'OTP sent successfully', email };
  }
}
