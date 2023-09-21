import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), RabbitMQModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
