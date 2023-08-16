import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '../../../entities/customers/customers.entity';
import { UsersRolesEntity } from '../../../entities/users/users_roles.entity';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([CustomersEntity, UsersRolesEntity])],
      providers: [CustomersService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
