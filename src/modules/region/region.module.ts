import { Module } from '@nestjs/common';
import { ProvinceController } from './controllers/province.controller';
import { ProvinceService } from './services/province.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from 'src/entities/master/province.entity';
import { CityEntity } from 'src/entities/master/city.entity';
import { CityController } from './controllers/ciity.controller';
import { CityService } from './services/city.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity, CityEntity])],
  controllers: [ProvinceController, CityController],
  providers: [ProvinceService, CityService],
})
export class RegionModule {}
