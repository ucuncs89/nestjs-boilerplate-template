import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGoogleService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googlePayload, i18n) {
    const findUser = await this.userRepository.findOne({
      where: [{ email: googlePayload.email.toLowerCase() }],
      relations: { roles: true },
    });
    if (!findUser) {
      throw new AppErrorNotFoundException(
        'Your email is not registered',
        'auth_error_not_found',
      );
    }
    if (findUser !== null) {
      if (!findUser.is_active) {
        throw new AppErrorException(
          'Your account is inactive. please contact admin to change your account status.',
        );
      }
      if (findUser.deleted_at) {
        throw new AppErrorNotFoundException(
          i18n.t('auth.error_not_found'),
          'auth_error_not_found',
        );
      }
    }
    const roles = findUser.roles.map((v) => v.id);

    const payloadJwt = {
      id: findUser.id,
      email: findUser.email,
      full_name: findUser.full_name,
      roles,
    };
    const token = this.jwtService.sign(payloadJwt);
    const expired_at = new Date().setDate(new Date().getDate() + 1);
    return { token, expired_at, refresh_token: '' };
  }
}
