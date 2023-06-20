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
  AppErrorOtpException,
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

  async login(loginUserDTO: LoginUserDTO, i18n) {
    const findUser = await this.userRepository.findOne({
      where: [{ email: loginUserDTO.email.toLowerCase() }],
      relations: { roles: true },
    });
    if (!findUser) {
      throw new AppErrorNotFoundException(
        i18n.t('auth.error_not_found'),
        'auth_error_not_found',
      );
    }
    if (findUser !== null) {
      if (!findUser.is_active) {
        throw new AppErrorException(
          i18n.t('auth.need_verify'),
          'auth_need_verify',
        );
      }
      if (findUser.need_verification) {
        throw new AppErrorException(
          i18n.t('auth.need_verify'),
          'auth_need_verify',
        );
      }
      if (!findUser.password) {
        throw new AppErrorException(
          i18n.t('auth.need_verify'),
          'auth_need_verify',
        );
      }
    }

    const comparePassword = await bcrypt.compare(
      loginUserDTO.password,
      findUser.password,
    );
    if (!comparePassword) {
      throw new AppErrorException(
        i18n.t('auth.password_wrong'),
        'auth_invalid_password',
      );
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
  async forgotPassword(email: string) {
    const findUser = await this.userService.findUserByEmail(email);
    if (!findUser) {
      throw new AuthEmailNotRegisterException();
    }
    if (!findUser.is_active) {
      throw new AuthNotActiveException();
    }
    const otp = await GenerateOtp.generateOTP();

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

    this.client.emit('send-email-forgot-password', {
      full_name: findUser.email,
      email,
      otp,
    });
    return true;
  }
  async otpVerification(payload, i18n) {
    const { email, otp } = payload;
    const usersExists = await this.userRepository
      .createQueryBuilder('users')
      .where('LOWER(email) = LOWER(:email)', { email })
      .getOne();
    if (!usersExists) {
      throw new AppErrorNotFoundException(
        i18n.t('users.not_found', 'user_not_found'),
      );
    }

    const findOtp = await this.userOtpRepository.findOne({
      where: { user_id: usersExists.id },
    });

    if (findOtp.otp !== otp) {
      throw new AppErrorException(
        i18n.t('auth.verification_otp_invalid'),
        'AUTH_VERIFICATION_OTP_INVALID',
      );
    }

    const minutesDiff = await DateUtils.diffMinsNow(findOtp.created_at);
    if (minutesDiff > 15) {
      throw new AppErrorException(
        i18n.t('auth.otp_expired_date'),
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
      throw new AppErrorException();
    }
  }
  async otpRequest(payload, i18n) {
    const { email, type } = payload;
    const usersExists = await this.userRepository
      .createQueryBuilder('users')
      .where('LOWER(email) = LOWER(:email)', { email })
      .getOne();

    if (!usersExists && type === 'FORGOT_PASSWORD') {
      throw new AppErrorNotFoundException(
        i18n.t('users.email_not_registered'),
        'email_not_registered',
      );
    }
    const usersRateLimiter = await this.otpRateLimiterRepository.findOne({
      where: { user_id: usersExists.id },
    });

    if (usersRateLimiter !== null) {
      const diffSeconds = await DateUtils.diffSecondNow(
        usersRateLimiter.updated_at,
      );

      if (usersRateLimiter.count > 5 && diffSeconds < 300) {
        throw new AppErrorOtpException(
          i18n.t('auth.otp_resend_limit'),
          'AUTH_OTP_RESEND_LIMIT',
          { otp_limiter_diff_seconds: diffSeconds },
        );
      }
    }
    try {
      const otp = await GenerateOtp.generateOTP();
      if (type === 'FORGOT_PASSWORD') {
        if (!usersExists) {
          throw new AppErrorNotFoundException(
            i18n.t('users.email_not_registered'),
            'email_not_registered',
          );
        }
        if (!usersExists.password) {
          throw new AppErrorException(
            i18n.t('auth.need_verify'),
            'auth_need_verify',
          );
        }
        this.client.emit('send-email-forgot-password', {
          full_name: usersExists.full_name,
          email,
          otp,
        });
      }

      await this.userOtpRepository.upsert(
        {
          user_id: usersExists.id,
          otp,
          created_at: new Date().toISOString(),
        },
        {
          conflictPaths: { user_id: true },
          skipUpdateIfNoValuesChanged: false,
        },
      );
      await this.otpRateLimiterRepository
        .createQueryBuilder()
        .insert()
        .into(OtpRateLimiterEntity)
        .values({
          user_id: usersExists.id,
          count: 1,
          type,
          updated_at: new Date().toISOString(),
        })
        .onConflict(
          `("user_id") DO UPDATE SET "type" = '${type}', count = otp_rate_limiter.count + 1, updated_at = NOW()`,
        )
        .execute();
      const findRateLimit = await this.otpRateLimiterRepository.findOne({
        where: { user_id: usersExists.id },
        select: {
          count: true,
        },
      });

      return { count: findRateLimit.count || 0 };
    } catch (error) {
      throw new AppErrorException(
        i18n.t('auth.need_verify'),
        'AUTH_OTP_SENDING_FAILED',
      );
    }
  }
}
