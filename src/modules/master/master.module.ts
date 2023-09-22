import { Module } from '@nestjs/common';
import { UnitService } from './services/unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from 'src/entities/master/unit.entity';
import { UnitController } from './controllers/unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity])],
  controllers: [UnitController],
  providers: [UnitService],
})
export class MasterModule {}
