import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useClass: DatabaseConnectionService,
  }),
  ConfigModule.forRoot({ isGlobal: true }),
  TestModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
