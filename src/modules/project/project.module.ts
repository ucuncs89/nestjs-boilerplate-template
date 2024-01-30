import { Module } from '@nestjs/common';
import { ProjectService } from './general/services/project.service';
import { ProjectController } from './general/controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectSizeController } from './general/controllers/project-size.controller';
import { ProjectSizeService } from './general/services/project-size.service';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVariantController } from './general/controllers/project-variant.controller';
import { ProjectVariantService } from './general/services/project-variant.service';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './general/controllers/project-history.controller';
import { ProjectHistoryService } from './general/services/project-history.service';
import { ProjectCostingMaterialController } from './costing/controllers/project-costing-material.controller';
import { ProjectCostingController } from './costing/controllers/project-costing.controller';
import { ProjectCostingService } from './costing/services/project-costing.service';
import { ProjectCostingMaterialService } from './costing/services/project-costing-material.service';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { ProjectCostingVendorMaterialController } from './costing/controllers/project-costing-vendor-material.controller';
import { ProjectCostingVendorMaterialService } from './costing/services/project-costing-vendor-material.service';
import { ProjectCostingVendorProductionController } from './costing/controllers/project-costing-vendor-production.controller';
import { ProjectCostingVendorProductionService } from './costing/services/project-costing-vendor-production.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectCostingShippingController } from './costing/controllers/project-costing-shipping.controller';
import { ProjectCostingShippingService } from './costing/services/project-costing-shipping.service';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { ProjectCostingAdditionalCostController } from './costing/controllers/project-costing-additional-cost.controller';
import { ProjectCostingAdditionalCostService } from './costing/services/project-costing-additional-cost.service';
import { ProjectSamplingEntity } from 'src/entities/project/project_sampling.entity';
import { ProjectCostingSamplingController } from './costing/controllers/project-costing-sampling.controller';
import { ProjectCostingSamplingService } from './costing/services/project-costing-sampling.service';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectCostingPriceController } from './costing/controllers/project-costing-price.controller';
import { ProjectCostingPriceService } from './costing/services/project-costing-price.service';
import { ProjectRemarksController } from './general/controllers/project-remarks.controller';
import { ProjectRemarksService } from './general/services/project-remarks.service';
import { ProjectRemarksEntity } from 'src/entities/project/project_remark.entity';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { ProjectCostingRecapController } from './costing/controllers/project-costing-recap.controller';
import { ProjectCostingRecapService } from './costing/services/project-costing-recap.service';
import { ProjectSamplingController } from './sampling/controllers/project-sampling.controller';
import { ProjectSamplingService } from './sampling/services/project-sampling.service';
import { ProjectPlanningController } from './planning/controllers/project-planning.controller';
import { ProjectPlanningService } from './planning/services/project-planning.service';
import { ProjectPlanningMaterialService } from './planning/services/project-planning-material.service';
import { ProjectPlanningVendorMaterialService } from './planning/services/project-planning-vendor-material.service';
import { ProjectPlanningVendorProductionService } from './planning/services/project-planning-vendor-production.service';
import { ProjectPlanningShippingService } from './planning/services/project-planning-shipping.service';
import { ProjectPlanningAdditionalCostService } from './planning/services/project-planning-additional-cost.service';
import { ProjectPlanningSamplingService } from './planning/services/project-planning-sampling.service';
import { ProjectPlanningRecapService } from './planning/services/project-planning-recap.service';
import { ProjectPlanningMaterialController } from './planning/controllers/project-planning-material.controller';
import { ProjectPlanningVendorMaterialController } from './planning/controllers/project-planning-vendor-material.controller';
import { ProjectPlanningVendorProductionController } from './planning/controllers/project-planning-vendor-production.controller';
import { ProjectPlanningShippingController } from './planning/controllers/project-planning-shipping.controller';
import { ProjectPlanningAdditionalCostController } from './planning/controllers/project-planning-additional-cost.controller';
import { ProjectPlanningSamplingController } from './planning/controllers/project-planning-sampling.controller';
import { ProjectPlanningPriceController } from './planning/controllers/project-planning-price.controller';
import { ProjectPlanningRecapController } from './planning/controllers/project-planning-recap.controller';
import { ProjectPlanningPriceService } from './planning/services/project-planning-price.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectSizeEntity,
      ProjectVariantEntity,
      ProjectHistoryEntity,
      ProjectMaterialItemEntity,
      ProjectVendorMaterialDetailEntity,
      ProjectVendorProductionEntity,
      ProjectVendorProductionDetailEntity,
      ProjectShippingEntity,
      ProjectAdditionalCostEntity,
      ProjectSamplingEntity,
      ProjectPriceEntity,
      ProjectRemarksEntity,
      ProjectVendorMaterialEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectSizeController,
    ProjectVariantController,
    ProjectHistoryController,
    ProjectRemarksController,
    ProjectCostingController,
    ProjectCostingMaterialController,
    ProjectCostingVendorMaterialController,
    ProjectCostingVendorProductionController,
    ProjectCostingShippingController,
    ProjectCostingAdditionalCostController,
    ProjectCostingSamplingController,
    ProjectCostingPriceController,
    ProjectCostingRecapController,
    ProjectSamplingController,
    ProjectPlanningController,
    ProjectPlanningMaterialController,
    ProjectPlanningVendorMaterialController,
    ProjectPlanningVendorProductionController,
    ProjectPlanningShippingController,
    ProjectPlanningAdditionalCostController,
    ProjectPlanningSamplingController,
    ProjectPlanningPriceController,
    ProjectPlanningRecapController,
  ],
  providers: [
    ProjectService,
    ProjectSizeService,
    ProjectVariantService,
    ProjectHistoryService,
    ProjectCostingService,
    ProjectCostingMaterialService,
    ProjectCostingVendorMaterialService,
    ProjectCostingVendorProductionService,
    ProjectCostingShippingService,
    ProjectCostingAdditionalCostService,
    ProjectCostingSamplingService,
    ProjectCostingPriceService,
    ProjectRemarksService,
    ProjectCostingRecapService,
    ProjectSamplingService,
    ProjectPlanningService,
    ProjectPlanningMaterialService,
    ProjectPlanningVendorMaterialService,
    ProjectPlanningVendorProductionService,
    ProjectPlanningShippingService,
    ProjectPlanningAdditionalCostService,
    ProjectPlanningSamplingService,
    ProjectPlanningPriceService,
    ProjectPlanningRecapService,
  ],
})
export class ProjectModule {}
