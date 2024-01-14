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
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectSizeController,
    ProjectVariantController,
    ProjectHistoryController,
    ProjectCostingController,
    ProjectCostingMaterialController,
    ProjectCostingVendorMaterialController,
    ProjectCostingVendorProductionController,
    ProjectCostingShippingController,
    ProjectCostingAdditionalCostController,
    ProjectCostingSamplingController,
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
  ],
})
export class ProjectModule {}
