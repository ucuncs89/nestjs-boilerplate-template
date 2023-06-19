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
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TestModule,
    AuthModule,
    RolesModule,
    UsersModule,
    RabbitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
