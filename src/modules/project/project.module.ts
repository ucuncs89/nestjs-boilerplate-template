import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './controllers/project_history.controller';
import { ProjectHistoryService } from './services/project_history.service';
import { ProjectDetailController } from './controllers/project_detail.controller';
import { ProjectDetailService } from './services/project_detail.service';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectMaterialController } from './controllers/project_material.controller';
import { ProjectMaterialService } from './services/project_material.service';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectHistoryEntity,
      ProjectDetailEntity,
      ProjectMaterialEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectDetailController,
    ProjectMaterialController,
  ],
  providers: [
    ProjectService,
    ProjectHistoryService,
    ProjectDetailService,
    ProjectMaterialService,
  ],
})
export class ProjectModule {}
