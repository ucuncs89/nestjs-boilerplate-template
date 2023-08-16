import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from '../../entities/activities/activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
