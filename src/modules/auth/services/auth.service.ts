import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { Repository } from 'typeorm';
import { LoginUserDTO } from '../dto/auth.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import * as bcrypt from 'bcrypt';
import {
  AuthEmailNotRegisterException,
  AuthNotActiveException,
} from 'src/exceptions/auth-exception';
import { GenerateOtp } from 'src/utils/generate-otp';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject('cloami_rmq') private client: ClientProxy,
  ) {}

  async login(loginUserDTO: LoginUserDTO) {
    const findUser = await this.userRepository.findOne({
      where: [{ email: loginUserDTO.email.toLowerCase() }],
      relations: { roles: true },
    });
    if (!findUser) {
      throw new AppErrorNotFoundException('User not found');
    }
    if (!findUser.is_active) {
      throw new AppErrorException('User not active');
    }
    const compare = await bcrypt.compare(
      loginUserDTO.password,
      findUser.password,
    );
    if (!compare) {
      throw new AppErrorException('Wrong Password');
    }
    const roles = findUser.roles.map((v) => v.id);

    const payloadJwt = {
      id: findUser.id,
      email: findUser.email,
      full_name: findUser.full_name,
      roles,
    };

    const token = this.jwtService.sign(payloadJwt);

    return { token, expired_at: new Date().setDate(new Date().getDate() + 1) };
  }
  async forgotPassword(email: string) {
    const findUser = await this.userService.findUserByEmail(email);
    if (!findUser) {
      throw new AuthEmailNotRegisterException();
    }
    if (!findUser.is_active) {
      throw new AuthNotActiveException();
    }
    const otp = await GenerateOtp.generateOTP();

    this.client.emit('send-email-register', {
      full_name: findUser.email,
      email,
      otp,
    });
    return true;
  }
}
