import { Module } from '@nestjs/common';
import { HomeService } from './services/home.service';
import { HomeController } from './controllers/home.controller';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
