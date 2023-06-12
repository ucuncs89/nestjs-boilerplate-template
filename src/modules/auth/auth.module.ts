import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register({
      secret: env.JWT_SECRET_KEY,
      signOptions: { expiresIn: env.JWT_EXPIRED },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}
