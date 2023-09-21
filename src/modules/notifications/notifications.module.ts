import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from 'src/entities/master/notifications.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationsEntity]), RabbitMQModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
