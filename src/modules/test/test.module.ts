import { Module } from '@nestjs/common';
import { TestController } from './controllers/test.controller';
import { TestService } from './services/test.service';
import { TestEntity } from '../../entities/test/test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity]), RabbitMQModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
