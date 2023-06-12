import { Injectable } from '@nestjs/common';
import { CreateTestDto } from '../dto/create-test.dto';
import { UpdateTestDto } from '../dto/update-test.dto';
import { TestEntity } from 'src/entities/test/test.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class TestService {
  @InjectRepository(TestEntity)
  private testRepository: Repository<TestEntity>;

  create(createTestDto: CreateTestDto) {
    throw new AppErrorException();
  }

  async findAll() {
    return await this.testRepository.find();
  }

  async findOne(id: number) {
    return 'hello';
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
