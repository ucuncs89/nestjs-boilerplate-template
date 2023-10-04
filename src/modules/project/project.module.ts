import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './controllers/project-history.controller';
import { ProjectHistoryService } from './services/project_history.service';
import { ProjectDetailController } from './controllers/project-detail.controller';
import { ProjectDetailService } from './services/project_detail.service';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectMaterialController } from './controllers/project-material.controller';
import { ProjectMaterialService } from './services/project_material.service';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import { ProjectVariantController } from './controllers/project-variant.controller';
import { ProjectVariantService } from './services/project_variant.service';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectHistoryEntity,
      ProjectDetailEntity,
      ProjectMaterialEntity,
      ProjectVariantEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectDetailController,
    ProjectMaterialController,
    ProjectVariantController,
  ],
  providers: [
    ProjectService,
    ProjectHistoryService,
    ProjectDetailService,
    ProjectMaterialService,
    ProjectVariantService,
  ],
})
export class ProjectModule {}
