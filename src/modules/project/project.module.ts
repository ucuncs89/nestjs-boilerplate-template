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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectSizeEntity,
      ProjectVariantEntity,
      ProjectHistoryEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    ProjectController,
    ProjectSizeController,
    ProjectVariantController,
    ProjectHistoryController,
  ],
  providers: [
    ProjectService,
    ProjectSizeService,
    ProjectVariantService,
    ProjectHistoryService,
  ],
})
export class ProjectModule {}
