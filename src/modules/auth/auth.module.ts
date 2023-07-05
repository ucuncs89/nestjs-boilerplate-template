import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/services/users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersOtpEntity } from 'src/entities/users/users_otp.entity';
import { OtpRateLimiterEntity } from 'src/entities/users/otp_rate_limiter.entity';
import { UsersPasswordEntity } from 'src/entities/users/users_password.entity';
import { UsersTokenEntity } from 'src/entities/users/users_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersOtpEntity,
      OtpRateLimiterEntity,
      UsersPasswordEntity,
      UsersTokenEntity,
    ]),
    ClientsModule.register([
      {
        name: 'cloami_rmq',
        transport: Transport.RMQ,
        options: {
          urls: [env.AMQP_URL],
          queue: 'cloami_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    JwtModule.register({
      secret: env.JWT_SECRET_KEY,
      signOptions: { expiresIn: env.JWT_EXPIRED },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}
