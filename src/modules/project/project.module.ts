import { Module } from '@nestjs/common';
import { ProjectController } from './general/controllers/project.controller';
import { ProjectService } from './general/services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './general/controllers/project-history.controller';
import { ProjectHistoryService } from './general/services/project-history.service';
import { ProjectDetailController } from './general/controllers/project-detail.controller';
import { ProjectDetailService } from './general/services/project-detail.service';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectMaterialController } from './planning/controllers/project-material.controller';
import { ProjectMaterialService } from './planning/services/project-material.service';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import { ProjectVariantController } from './planning/controllers/project-variant.controller';
import { ProjectVariantService } from './planning/services/project-variant.service';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVendorMaterialController } from './planning/controllers/project-vendor-material.controller';
import { ProjectVendorMaterialService } from './planning/services/project-vendor-material.service';
import { ProjectVendorProductionController } from './planning/controllers/project-vendor-production.controller';
import { ProjectVendorProductionService } from './planning/services/project-vendor-production.service';
import { ProjectShippingController } from './planning/controllers/project-shipping.controller';
import { ProjectShippingService } from './planning/services/project-shipping.service';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { ProjectSetSamplingEntity } from 'src/entities/project/project_set_sampling.entity';
import { ProjectSetSamplingService } from './planning/services/project-set-sampling.service';
import { ProjectSetSamplingController } from './planning/controllers/project-set-sampling.controller';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceController } from './planning/controllers/project-price.controller';
import { ProjectPriceService } from './planning/services/project-price.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectConfirmReviewController } from './planning/controllers/project-confirm-review.controller';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectVendorMaterialSamplingController } from './sampling/controllers/project-vendor-material-sampling.controller';
import { ProjectVendorMaterialSamplingService } from './sampling/services/project-vendor-material-sampling.service';
import { ProjectMaterialSamplingService } from './sampling/services/project-material-sampling.service';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';
import { ProjectVendorProductionSamplingService } from './sampling/services/project-vendor-production-sampling.service';
import { ProjectVendorProductionSamplingController } from './sampling/controllers/project-vendor-production.controller';
import { ProjectPurchaseOrderSamplingController } from './sampling/controllers/project-purchase-order-sampling.controller';
import { ProjectPurchaseOrderSamplingService } from './sampling/services/project-purchase-order-sampling.service';
import { ProjectPurchaseOrderEntity } from 'src/entities/project/project_purchase_order.entity';
import { PurchaseOrderEntity } from 'src/entities/purchase-order/purchase_order.entity';
import { ProjectDevSamplingController } from './sampling/controllers/project-dev-sampling.controller';
import { ProjectDevSamplingService } from './sampling/services/project-dev-sampling.service';
import { ProjectSamplingStatusEntity } from 'src/entities/project/project_sampling_status.entity';
import { ProjectSamplingRevisiEntity } from 'src/entities/project/project_sampling_revisi.entity';
import { ProjectVendorMaterialProductionController } from './production/controllers/project-vendor-material-production.controller';
import { ProjectMaterialProductionService } from './production/services/project-material-production.service';
import { ProjectVendorMaterialProductionService } from './production/services/project-vendor-material-production.service';
import { ProjectVendorProductionProductionService } from './production/services/project-vendor-production-production.service';
import { ProjectVendorProductionProductionController } from './production/controllers/project-vendor-production-production.controller';
import { ProjectPurchaseOrderProductionController } from './production/controllers/project-purchase-order-production.controller';
import { ProjectPurchaseOrderProductionService } from './production/services/project-purchase-order-production.service';
import { GenerateProjectProductionService } from './general/services/generate-project-production.service';
import { ProjectReviewSamplingController } from './sampling/controllers/project-review-sampling.controller';
import { ProjectTrackingProductionController } from './production/controllers/project-tracking-production.controllers';
import { ProjectTrackingProductionService } from './production/services/project-tracking-production.service';
import { ProjectInvoiceProductionController } from './production/controllers/project-invoice-production.controller';
import { ProjectInvoiceProductionService } from './production/services/project-invoice-production.service';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectShippingProductionController } from './production/controllers/project-shipping-production.controller';
import { ProjectShippingProductionService } from './production/services/project-shipping-production.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectHistoryEntity,
      ProjectDetailEntity,
      ProjectMaterialEntity,
      ProjectVariantEntity,
      ProjectFabricEntity,
      ProjectShippingEntity,
      ProjectAccessoriesSewingEntity,
      ProjectAccessoriesPackagingEntity,
      ProjectSetSamplingEntity,
      ProjectPriceEntity,
      ProjectVendorProductionEntity,
      ProjectVendorMaterialFabricEntity,
      ProjectVendorMaterialAccessoriesPackagingEntity,
      ProjectVendorMaterialAccessoriesSewingEntity,
      ProjectSizeEntity,
      ProjectVendorMaterialFinishedGoodEntity,
      ProjectVendorProductionDetailEntity,
      ProjectVendorMaterialFabricDetailEntity,
      ProjectVendorMaterialAccessoriesSewingDetailEntity,
      ProjectVendorMaterialAccessoriesPackagingDetailEntity,
      ProjectVendorMaterialFinishedGoodDetailEntity,
      ProjectPurchaseOrderEntity,
      PurchaseOrderEntity,
      ProjectSamplingStatusEntity,
      ProjectSamplingRevisiEntity,
      InvoiceEntity,
      ProjectInvoiceEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectDetailController,
    ProjectMaterialController,
    ProjectVariantController,
    ProjectVendorMaterialController,
    ProjectVendorProductionController,
    ProjectShippingController,
    ProjectSetSamplingController,
    ProjectPriceController,
    ProjectConfirmReviewController,
    ProjectVendorMaterialSamplingController,
    ProjectVendorProductionSamplingController,
    ProjectPurchaseOrderSamplingController,
    ProjectDevSamplingController,
    ProjectReviewSamplingController,
    ProjectVendorMaterialProductionController,
    ProjectVendorProductionProductionController,
    ProjectPurchaseOrderProductionController,
    ProjectTrackingProductionController,
    ProjectInvoiceProductionController,
    ProjectShippingProductionController,
  ],
  providers: [
    ProjectService,
    ProjectHistoryService,
    ProjectDetailService,
    ProjectMaterialService,
    ProjectVariantService,
    ProjectVendorMaterialService,
    ProjectVendorProductionService,
    ProjectShippingService,
    ProjectSetSamplingService,
    ProjectPriceService,
    ProjectMaterialSamplingService,
    ProjectVendorMaterialSamplingService,
    ProjectVendorProductionSamplingService,
    ProjectPurchaseOrderSamplingService,
    ProjectDevSamplingService,
    ProjectMaterialProductionService,
    ProjectVendorMaterialProductionService,
    ProjectVendorProductionProductionService,
    ProjectPurchaseOrderProductionService,
    GenerateProjectProductionService,
    ProjectTrackingProductionService,
    ProjectInvoiceProductionService,
    ProjectShippingProductionService,
  ],
})
export class ProjectModule {}
