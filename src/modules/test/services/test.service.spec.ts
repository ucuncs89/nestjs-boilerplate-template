import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from '../../../entities/test/test.entity';

describe('TestService', () => {
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([TestEntity])],
      providers: [TestService],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
