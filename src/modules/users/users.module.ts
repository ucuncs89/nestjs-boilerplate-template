import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../entities/users/users.entity';
import { UsersService } from './services/users.service';
import { env } from 'process';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersPasswordEntity } from '../../entities/users/users_password.entity';
import { UsersManageController } from './controllers/users-manage.controller';
import { PermissionsEntity } from '../../entities/permission/permission.entity';
import { UsersController } from './controllers/users.controller';
import { UsersTokenEntity } from 'src/entities/users/users_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersPasswordEntity,
      PermissionsEntity,
      UsersTokenEntity,
    ]),
    JwtModule.register({
      secret: env.JWT_SECRET_KEY,
      signOptions: { expiresIn: env.JWT_EXPIRED },
    }),
  ],
  controllers: [UsersManageController, UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
