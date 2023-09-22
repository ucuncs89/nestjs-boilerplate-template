import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectHistoryEntity } from 'src/entities/project/project_history.entity';
import { ProjectHistoryController } from './controllers/project_history.controller';
import { ProjectHistoryService } from './services/project_history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, ProjectHistoryEntity]),
    RabbitMQModule,
  ],
  controllers: [ProjectController, ProjectHistoryController],
  providers: [ProjectService, ProjectHistoryService],
})
export class ProjectModule {}
