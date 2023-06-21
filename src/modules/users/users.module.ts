import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { UsersService } from './services/users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersActivationController } from './controllers/users-activation.controller';
import { UsersActivationService } from './services/users-activation.service';
import { UsersPasswordEntity } from 'src/entities/users/users_password.entity';
import { UsersManageController } from './controllers/users-manage.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, UsersPasswordEntity]),
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
  controllers: [UsersManageController, UsersActivationController],
  providers: [UsersService, JwtService, UsersActivationService],
})
export class UsersModule {}
