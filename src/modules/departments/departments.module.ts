import { Module } from '@nestjs/common';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsEntity } from '../../entities/departments/departments.entity';
import { DepartmentsExcelController } from './controllers/departments-excel.controller';
import { DepartmentsExcelService } from './services/departments-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentsEntity])],
  controllers: [DepartmentsController, DepartmentsExcelController],
  providers: [DepartmentsService, DepartmentsExcelService],
})
export class DepartmentsModule {}
