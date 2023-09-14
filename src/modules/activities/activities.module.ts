import { Module } from '@nestjs/common';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from '../../entities/activities/activities.entity';
import { ActivitiesExcelController } from './controllers/activities-excel.controller';
import { ActivitiesExcelService } from './services/activities-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitiesEntity])],
  controllers: [ActivitiesController, ActivitiesExcelController],
  providers: [ActivitiesService, ActivitiesExcelService],
})
export class ActivitiesModule {}
