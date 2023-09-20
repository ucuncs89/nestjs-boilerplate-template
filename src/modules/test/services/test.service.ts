import { Injectable } from '@nestjs/common';
import { TestEntity } from '../../../entities/test/test.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';

@Injectable()
export class TestService {
  @InjectRepository(TestEntity)
  private testRepository: Repository<TestEntity>;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async findAll() {
    this.rabbitMQService.send('send-notif-test', {
      to_user_id: 1,
      from_user_id: 1,
    });
    return await this.testRepository.find();
  }
}
