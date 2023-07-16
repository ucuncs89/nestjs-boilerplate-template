import { Injectable } from '@nestjs/common';
import { TestEntity } from '../../../entities/test/test.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TestService {
  @InjectRepository(TestEntity)
  private testRepository: Repository<TestEntity>;

  async findAll() {
    return await this.testRepository.find();
  }
}
