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
      ProjectSamplingStatusEntity,
      ProjectSamplingRevisiEntity,
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
  ],
})
export class RefactorProjectModule {}
