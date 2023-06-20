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
import { UsersOtpEntity } from 'src/entities/users/users_otp.entity';
import { OtpRateLimiterEntity } from 'src/entities/users/otp_rate_limiter.entity';
import { DateUtils } from 'src/utils/date-utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,

    @InjectRepository(UsersOtpEntity)
    private userOtpRepository: Repository<UsersOtpEntity>,

    @InjectRepository(OtpRateLimiterEntity)
    private otpRateLimiterRepository: Repository<OtpRateLimiterEntity>,

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

    // await this.prisma.user.update({
    //   where: { id: findUser.id },
    //   data: { is_forgot_password: true },
    // });
    findUser.is_forgot_password = true;
    await this.userRepository.save(findUser);
    await this.userOtpRepository.upsert(
      {
        user_id: findUser.id,
        otp: otp,
        created_at: new Date().toISOString(),
      },
      ['user_id'],
    );

    this.client.emit('send-email-register', {
      full_name: findUser.email,
      email,
      otp,
    });
    return true;
  }
  async otpVerification(payload) {
    const { email, otp } = payload;
    const usersExists = await this.userRepository
      .createQueryBuilder('users')
      .where('LOWER(email) = LOWER(:email)', { email })
      .getOne();
    if (!usersExists) {
      throw new AppErrorNotFoundException();
      // i18n.t('users.not_found', 'user_not_found'),
    }

    const findOtp = await this.userOtpRepository.findOne({
      where: { user_id: usersExists.id },
    });

    if (findOtp.otp !== otp) {
      throw new AppErrorException(
        // i18n.t('auth.verification_otp_invalid'),
        'AUTH_VERIFICATION_OTP_INVALID',
      );
    }

    const minutesDiff = await DateUtils.diffMinsNow(findOtp.created_at);
    if (minutesDiff > 15) {
      throw new AppErrorException(
        // i18n.t('auth.otp_expired_date'),
        'OTP_EXPIRED_DATE',
      );
    }
    try {
      const user = await this.userRepository.findOne({
        where: { id: usersExists.id },
      });
      user.updated_by = usersExists.id;
      user.updated_at = new Date().toISOString();
      await this.userRepository.save(user);
      const payloadJwt = {
        id: user.id,
        uuid: user.uuid,
      };
      const token = this.jwtService.sign(payloadJwt);
      const expired_at = new Date().setDate(new Date().getDate() + 1);
      await this.otpRateLimiterRepository.delete({ user_id: user.id });
      return { token, expired_at };
    } catch (e) {
      throw new AppErrorException(e);
    }
  }
}
