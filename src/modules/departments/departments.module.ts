import { Module } from '@nestjs/common';
import { DepartmentsService } from './services/departments.service';
import { DepartmentsController } from './controllers/departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsEntity } from '../../entities/departments/departments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentsEntity])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
