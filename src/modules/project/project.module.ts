import { Module } from '@nestjs/common';
import { ProjectService } from './general/services/project.service';
import { ProjectController } from './general/controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';
import { ProjectSizeController } from './general/controllers/project-size.controller';
import { ProjectSizeService } from './general/services/project-size.service';
import { ProjectSizeEntity } from 'src/entities/project/project_size.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, ProjectSizeEntity]),
    RabbitMQModule,
  ],
  controllers: [ProjectController, ProjectSizeController],
  providers: [ProjectService, ProjectSizeService],
})
export class ProjectModule {}
