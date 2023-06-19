import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),

    ClientsModule.register([
      {
        name: 'cloami_rmq',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://xsjyansc:w0ZMci_JRO6z_DdTl6QWya5d-aQiec7p@woodpecker.rmq.cloudamqp.com/xsjyansc',
          ],
          queue: 'cloami_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    TestModule,
    AuthModule,
    RolesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
