import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './controllers/project_history.controller';
import { ProjectHistoryService } from './services/project_history.service';
import { ProjectPlanningEntity } from 'src/entities/project/project_planning.entity';
import { ProjectPlanningController } from './controllers/project_planning.controller';
import { ProjectPlanningService } from './services/project_planning.service';
import { ProjectPlanningFabricEntity } from 'src/entities/project/project_planning_fabric.entity';
import { ProjectPlanningAccessoriesSewingEntity } from 'src/entities/project/project_planning_accessories_sewing.entity';
import { ProjectPlanningAccessoriesPackagingEntity } from 'src/entities/project/project_planning_accessories_packaging.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectHistoryEntity,
      ProjectPlanningEntity,
      ProjectPlanningFabricEntity,
      ProjectPlanningAccessoriesSewingEntity,
      ProjectPlanningAccessoriesPackagingEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectHistoryController,
    ProjectPlanningController,
  ],
  providers: [ProjectService, ProjectHistoryService, ProjectPlanningService],
})
export class ProjectModule {}
