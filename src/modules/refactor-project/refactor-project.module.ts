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
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectDetailController,
    ProjectPlanningMaterialController,
    ProjectPlanningVariantController,
  ],
  providers: [
    ProjectDetailService,
    ProjectService,
    ProjectHistoryService,
    ProjectPlanningMaterialService,
    ProjectPlanningVariantService,
  ],
})
export class RefactorProjectModule {}
