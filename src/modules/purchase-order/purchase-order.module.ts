import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderEntity])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
