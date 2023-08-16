import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './vendors.service';
import { UsersRolesEntity } from '../../../entities/users/users_roles.entity';
import { VendorsEntity } from '../../../entities/vendors/vendors.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([VendorsEntity, UsersRolesEntity])],
      providers: [VendorsService],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
