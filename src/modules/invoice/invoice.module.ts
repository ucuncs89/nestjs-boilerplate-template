import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      ProjectInvoiceEntity,
      ProjectVendorMaterialFabricDetailEntity,
      ProjectVendorMaterialAccessoriesSewingDetailEntity,
      ProjectVendorMaterialAccessoriesPackagingDetailEntity,
      ProjectVendorProductionDetailEntity,
      ProjectVendorMaterialFinishedGoodDetailEntity,
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
