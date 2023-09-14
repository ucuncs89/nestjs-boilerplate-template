import { Module } from '@nestjs/common';
import { AccessoriesPackagingController } from './controllers/accessories-packaging.controller';
import { AccessoriesPackagingService } from './services/accessories-packaging.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessoriesPackagingEntity } from 'src/entities/accessories/accessories_packaging.entity';
import { AccessoriesSewingEntity } from 'src/entities/accessories/accessories_sewing.entity';
import { AccessoriesSewingController } from './controllers/accessories-sewing.controller';
import { AccessoriesSewingService } from './services/accessories-sewing.service';
import { AccessoriesPackagingExcelController } from './controllers/accessories-packaging-excel.controller';
import { AccessoriesExcelPackagingService } from './services/accessories-packaging-excel.service';
import { AccessoriesSewingExcelController } from './controllers/accessories-sewing-excel.controller';
import { AccessoriesSewingExcelService } from './services/accessories-sewing-excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccessoriesPackagingEntity,
      AccessoriesSewingEntity,
    ]),
  ],
  controllers: [
    AccessoriesPackagingController,
    AccessoriesSewingController,
    AccessoriesPackagingExcelController,
    AccessoriesSewingExcelController,
  ],
  providers: [
    AccessoriesPackagingService,
    AccessoriesSewingService,
    AccessoriesExcelPackagingService,
    AccessoriesSewingExcelService,
  ],
})
export class AccessoriesModule {}
