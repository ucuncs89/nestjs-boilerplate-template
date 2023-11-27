import { Module } from '@nestjs/common';
import { UnitService } from './services/unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from 'src/entities/master/unit.entity';
import { UnitController } from './controllers/unit.controller';
import { CostEntity } from 'src/entities/master/cost.entity';
import { CostController } from './controllers/cost.controller';
import { CostService } from './services/cost.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity, CostEntity])],
  controllers: [UnitController, CostController],
  providers: [UnitService, CostService],
})
export class MasterModule {}
