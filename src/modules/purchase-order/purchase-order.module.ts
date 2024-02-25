import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { PurchaseOrderPdfService } from './services/purchase-order-pdf.service';
import { PurchaseOrderPdfController } from './controllers/purchase-order-pdf.controller';
import { PurchaseOrderExcelController } from './controllers/purchase-order-excel.controller';
import { PurchaseOrderExcelService } from './services/purchase-order-excel.service';
import { PurchaseOrderDetailEntity } from 'src/entities/purchase-order/purchase_order_detail.entity';
import { PurchaseOrderStatusEntity } from 'src/entities/purchase-order/purchase_order_status.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrderEntity,
      PurchaseOrderDetailEntity,
      PurchaseOrderStatusEntity,
      ProjectVendorProductionDetailEntity,
      ProjectVendorMaterialDetailEntity,
    ]),
  ],
  controllers: [
    PurchaseOrderController,
    PurchaseOrderPdfController,
    PurchaseOrderExcelController,
  ],
  providers: [
    PurchaseOrderService,
    PurchaseOrderPdfService,
    PurchaseOrderExcelService,
  ],
})
export class PurchaseOrderModule {}
