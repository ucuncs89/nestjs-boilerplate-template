import { Module } from '@nestjs/common';
import { FabricService } from './services/fabric.service';
import { FabricController } from './controllers/fabric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricEntity } from '../../entities/fabric/fabric.entity';
import { FabricVendorEntity } from '../../entities/fabric/fabric_vendor.entity';
import { FabricVendorController } from './controllers/fabric-vendor.controller';
import { FabricVendorService } from './services/fabric-vendor.service';
import { FabricExcelController } from './controllers/fabric-excel.controller';
import { FabricExcelService } from './services/fabric-excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([FabricEntity, FabricVendorEntity])],
  controllers: [
    FabricController,
    FabricVendorController,
    FabricExcelController,
  ],
  providers: [FabricService, FabricVendorService, FabricExcelService],
})
export class FabricModule {}
