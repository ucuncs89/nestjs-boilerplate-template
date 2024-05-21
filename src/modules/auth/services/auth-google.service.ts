import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import { AppErrorException } from '../../../exceptions/app-exception';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGoogleService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(email: string, i18n) {
    const findUser = await this.userRepository.findOne({
      where: [{ email: email.toLowerCase() }],
      relations: { roles: true },
    });
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

  async createGoogleAccount(payload) {
    try {
      const data = this.userRepository.create({
        email: payload.email,
        is_active: true,
        need_verification: false,
        full_name: payload.full_name,
        password: '',
        created_at: new Date().toISOString(),
      });
      await this.userRepository.save(data);
      const payloadJwt = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        roles: [],
      };
      const token = this.jwtService.sign(payloadJwt);
      const expired_at = new Date().setDate(new Date().getDate() + 1);
      return { token, expired_at, refresh_token: '' };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
