import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../entities/users/users.entity';
import { UsersService } from './services/users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersActivationController } from './controllers/users-activation.controller';
import { UsersActivationService } from './services/users-activation.service';
import { UsersPasswordEntity } from '../../entities/users/users_password.entity';
import { UsersManageController } from './controllers/users-manage.controller';
import { PermissionsEntity } from '../../entities/permission/permission.entity';
import { UsersController } from './controllers/users.controller';
import { UsersWorkspaceService } from './services/users-workspace.service';
import { UsersTokenEntity } from 'src/entities/users/users_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersPasswordEntity,
      PermissionsEntity,
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
  controllers: [
    UsersManageController,
    UsersController,
    UsersActivationController,
  ],
  providers: [
    UsersService,
    JwtService,
    UsersActivationService,
    UsersWorkspaceService,
  ],
})
export class UsersModule {}
