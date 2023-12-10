import { Module } from '@nestjs/common';
import { ProjectDetailController } from './general/controllers/project-detail.controller';
import { ProjectDetailService } from './general/services/project-detail.service';
import { ProjectService } from './general/services/project.service';
import { ProjectController } from './general/controllers/project.controller';
import { ProjectHistoryController } from './general/controllers/project-history.controller';
import { ProjectHistoryService } from './general/services/project-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectSetSamplingEntity } from 'src/entities/project/project_set_sampling.entity';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { ProjectPriceAdditionalEntity } from 'src/entities/project/project_price_additional.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectPlanningMaterialController } from './planning/controllers/project-planning-material.controller';
import { ProjectPlanningMaterialService } from './planning/services/project-planning-material.service';
import { ProjectPlanningVariantController } from './planning/controllers/project-planning-variant.controller';
import { ProjectPlanningVariantService } from './planning/services/project-planning-variant.service';
import { ProjectPlanningVendorMaterialService } from './planning/services/project-planning-vendor-material.service';
import { ProjectPlanningVendorMaterialController } from './planning/controllers/project-planning-vendor-material.controller';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { ProjectPlanningVendorProductionController } from './planning/controllers/project-planning-vendor-production.controller';
import { ProjectPlanningVendorProductionService } from './planning/services/project-planning-vendor-production.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectPlanningShippingController } from './planning/controllers/project-planning-shipping.controller';
import { ProjectPlanningShippingService } from './planning/services/project-planning-shipping.service';
import { ProjectPlanningPriceService } from './planning/services/project-planning-price.service';
import { ProjectPlanningPriceController } from './planning/controllers/project-planning-price.controller';
import { ProjectPlanningConfirmReviewController } from './planning/controllers/project-planning-confirm-review.controller';
import { ProjectPlanningSetSamplingService } from './planning/services/project-planning-set-sampling.service';
import { ProjectPlanningSetSamplingController } from './planning/controllers/project-planning-set-sampling.controller';
import { ProjectSamplingVendorMaterialController } from './sampling/controllers/project-sampling-vendor-material.controller';
import { ProjectSamplingVendorProductionController } from './sampling/controllers/project-sampling-vendor-production.controller';
import { ProjectSamplingVendorMaterialService } from './sampling/services/project-sampling-vendor-material.service';
import { ProjectSamplingVendorProductionService } from './sampling/services/project-sampling-vendor-production.service';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { ProjectSamplingPurchaseOrderController } from './sampling/controllers/project-sampling-purchase-order.controller';
import { ProjectSamplingPurchaseOrderService } from './sampling/services/project-sampling-purchase-order.service';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { PurchaseOrderService } from '../purchase-order/services/purchase-order.service';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectDevSamplingController } from './sampling/controllers/project-dev-sampling.controller';
import { ProjectDevSamplingService } from './sampling/services/project-dev-sampling.service';
import { ProjectSamplingStatusEntity } from 'src/entities/project/project_sampling_status.entity';
import { ProjectSamplingRevisiEntity } from 'src/entities/project/project_sampling_revisi.entity';
import { ProjectSamplingReviewController } from './sampling/controllers/project-sampling-review.controller';
import { ProjectProductionVendorMaterialController } from './production/controllers/project-production-vendor-material.controller';
import { ProjectProductionVendorMaterialService } from './production/services/project-production-vendor-material.service';
import { ProjectProductionVendorProductionController } from './production/controllers/project-production-vendor-production.controller';
import { ProjectProductionVendorProductionService } from './production/services/project-production-vendor-production.service';
import { ProjectProductionPurchaseOrderService } from './production/services/project-production-purchase-order.service';
import { ProjectProductionPurchaseOrderController } from './production/controllers/project-production-purchase-order.controller';
import { ProjectProductionTrackingService } from './production/services/project-production-tracking.service';
import { ProjectProductionTrackingController } from './production/controllers/project-production-tracking.controllers';
import { ProjectProductionInvoiceController } from './production/controllers/project-production-invoice.controller';
import { ProjectProductionInvoiceService } from './production/services/project-production-invoice.service';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectProductionShippingController } from './production/controllers/project-production-shipping.controller';
import { ProjectProductionShippingService } from './production/services/project-production-shipping.service';
import { ProjectProductionPriceService } from './production/services/project-production-price.service';
import { ProjectProductionPriceController } from './production/controllers/project-production-price.controller';
import { ProjectProductionConfirmationService } from './production/services/project-production-confirmation.service';
import { ProjectProductionConfirmationController } from './production/controllers/project-production-confirmation.controller';
import { PurchaseOrderApprovalEntity } from 'src/entities/purchase-order/purchase_order_approval.entity';
import { InvoiceService } from '../invoice/services/invoice.service';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';
import { ProjectPlanningConfirmService } from './planning/services/project-planning-confirm.service';
import { ProjectShippingPackingEntity } from 'src/entities/project/project_shipping_packing.entity';
import { ProjectShippingPackingDetailEntity } from 'src/entities/project/project_shipping_packing_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectHistoryEntity,
      ProjectDetailEntity,
      ProjectMaterialItemEntity,
      ProjectVariantEntity,
      ProjectShippingEntity,
      ProjectSetSamplingEntity,
      ProjectPriceEntity,
      ProjectSizeEntity,
      ProjectPriceAdditionalEntity,
      ProjectVendorMaterialDetailEntity,
      ProjectVendorProductionEntity,
      ProjectVendorProductionDetailEntity,
      ProjectShippingEntity,
      ProjectPurchaseOrderEntity,
      ProjectVendorMaterialEntity,
      PurchaseOrderEntity,
      ProjectVendorMaterialFabricDetailEntity,
      ProjectVendorMaterialAccessoriesSewingDetailEntity,
      ProjectVendorMaterialAccessoriesPackagingDetailEntity,
      ProjectVendorMaterialFinishedGoodDetailEntity,
      ProjectSamplingStatusEntity,
      ProjectSamplingRevisiEntity,
      InvoiceEntity,
      ProjectInvoiceEntity,
      PurchaseOrderApprovalEntity,
      ProjectShippingPackingEntity,
      ProjectShippingPackingDetailEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectDetailController,
    ProjectPlanningMaterialController,
    ProjectPlanningVariantController,
    ProjectPlanningVendorMaterialController,
    ProjectPlanningVendorProductionController,
    ProjectPlanningSetSamplingController,
    ProjectPlanningShippingController,
    ProjectPlanningPriceController,
    ProjectPlanningConfirmReviewController,
    ProjectSamplingVendorMaterialController,
    ProjectSamplingVendorProductionController,
    ProjectSamplingPurchaseOrderController,
    ProjectDevSamplingController,
    ProjectSamplingReviewController,
    ProjectProductionVendorMaterialController,
    ProjectProductionVendorProductionController,
    ProjectProductionPurchaseOrderController,
    ProjectProductionTrackingController,
    ProjectProductionInvoiceController,
    ProjectProductionShippingController,
    ProjectProductionPriceController,
    ProjectProductionConfirmationController,
  ],
  providers: [
    ProjectDetailService,
    ProjectService,
    ProjectHistoryService,
    ProjectPlanningMaterialService,
    ProjectPlanningVariantService,
    ProjectPlanningVendorMaterialService,
    ProjectPlanningVendorProductionService,
    ProjectPlanningShippingService,
    ProjectPlanningPriceService,
    ProjectPlanningSetSamplingService,
    ProjectSamplingVendorMaterialService,
    ProjectSamplingVendorProductionService,
    ProjectSamplingPurchaseOrderService,
    PurchaseOrderService,
    ProjectDevSamplingService,
    ProjectProductionVendorMaterialService,
    ProjectProductionVendorProductionService,
    ProjectProductionPurchaseOrderService,
    ProjectProductionTrackingService,
    ProjectProductionInvoiceService,
    ProjectProductionShippingService,
    ProjectProductionPriceService,
    ProjectProductionConfirmationService,
    InvoiceService,
    ProjectPlanningConfirmService,
  ],
})
export class RefactorProjectModule {}
