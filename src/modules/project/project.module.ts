import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './controllers/project-history.controller';
import { ProjectHistoryService } from './services/project-history.service';
import { ProjectDetailController } from './controllers/project-detail.controller';
import { ProjectDetailService } from './services/project-detail.service';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectMaterialController } from './controllers/project-material.controller';
import { ProjectMaterialService } from './services/project-material.service';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import { ProjectVariantController } from './controllers/project-variant.controller';
import { ProjectVariantService } from './services/project-variant.service';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVendorMaterialController } from './controllers/project-vendor-material.controller';
import { ProjectVendorMaterialService } from './services/project-vendor-material.service';
import { ProjectVendorProductionController } from './controllers/project-vendor-production.controller';
import { ProjectVendorProductionService } from './services/project-vendor-production.service';
import { ProjectShippingController } from './controllers/project-shipping.controller';
import { ProjectShippingService } from './services/project-shipping.service';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { ProjectSetSamplingEntity } from 'src/entities/project/project_set_sampling.entity';
import { ProjectSetSamplingService } from './services/project-set-sampling.service';
import { ProjectSetSamplingController } from './controllers/project-set-sampling.controller';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceController } from './controllers/project-price.controller';
import { ProjectPriceService } from './services/project-price.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorMaterialFabricEntity } from 'src/entities/project/project_vendor_material_fabric.entity';
import { ProjectVendorMaterialAccessoriesPackagingEntity } from 'src/entities/project/project_vendor_material_accessories_packaging.entity';
import { ProjectVendorMaterialAccessoriesSewingEntity } from 'src/entities/project/project_vendor_material_accessories_sewing.entity';
import { ProjectConfirmReviewController } from './controllers/project-confirm-review.controller';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { ProjectVendorMaterialFinishedGoodEntity } from 'src/entities/project/project_vendor_material_finished_good.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';

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
  ],
})
export class ProjectModule {}
