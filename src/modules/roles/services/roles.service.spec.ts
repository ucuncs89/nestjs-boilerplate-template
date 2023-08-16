import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesEntity } from '../../../entities/roles/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([RolesEntity])],
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
