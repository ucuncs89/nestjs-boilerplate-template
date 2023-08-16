import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import { UsersOtpEntity } from '../../../entities/users/users_otp.entity';
import { OtpRateLimiterEntity } from '../../../entities/users/otp_rate_limiter.entity';
import { UsersPasswordEntity } from '../../../entities/users/users_password.entity';
import { UsersTokenEntity } from '../../../entities/users/users_token.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          UsersEntity,
          UsersOtpEntity,
          OtpRateLimiterEntity,
          UsersPasswordEntity,
          UsersTokenEntity,
        ]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
