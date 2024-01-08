import { Module } from '@nestjs/common';
import { ProjectService } from './general/services/project.service';
import { ProjectController } from './general/controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), RabbitMQModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
