import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { AppErrorUnauthorizedException } from 'src/exceptions/app-exception';
import { AuthService } from './services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    // const user = await this.authService.validateUserJWT(payload);
    // if (!user) {
    //   throw new AppErrorUnauthorizedException('User Unaunthorized');
    // }
    return payload;
  }
}
