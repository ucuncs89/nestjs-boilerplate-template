import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { PurchaseOrderPdfService } from './services/purcahse-order-pdf.service';
import { PurchaseOrderPdfController } from './controllers/purchase-order-pdf.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrderEntity,
      ProjectPurchaseOrderEntity,
      ProjectVendorMaterialFabricDetailEntity,
      ProjectVendorMaterialFabricEntity,
      ProjectVendorMaterialAccessoriesSewingDetailEntity,
      ProjectVendorMaterialAccessoriesPackagingDetailEntity,
      ProjectVendorProductionDetailEntity,
    ]),
  ],
  controllers: [PurchaseOrderController, PurchaseOrderPdfController],
  providers: [PurchaseOrderService, PurchaseOrderPdfService],
})
export class PurchaseOrderModule {}
