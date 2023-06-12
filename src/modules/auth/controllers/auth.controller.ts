import { Body, Controller, Post } from '@nestjs/common';
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
}
