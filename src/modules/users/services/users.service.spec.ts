import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import { UsersPasswordEntity } from '../../../entities/users/users_password.entity';
import { PermissionsEntity } from '../../../entities/permission/permission.entity';
import { DatabaseConnectionService } from '../../../config/database.config';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConnectionService,
        }),
        TypeOrmModule.forFeature([
          UsersEntity,
          UsersPasswordEntity,
          PermissionsEntity,
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
