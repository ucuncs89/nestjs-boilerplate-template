import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { PurchaseOrderPdfService } from './services/purchase-order-pdf.service';
import { PurchaseOrderPdfController } from './controllers/purchase-order-pdf.controller';
import { PurchaseOrderApprovalEntity } from 'src/entities/purchase-order/purchase_order_approval.entity';
import { PurchaseOrderExcelController } from './controllers/purchase-order-excel.controller';
import { PurchaseOrderExcelService } from './services/purchase-order-excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrderApprovalEntity,
      PurchaseOrderEntity,
      PurchaseOrderExcelController,
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
