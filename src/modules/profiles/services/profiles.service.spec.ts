import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import { PermissionsEntity } from '../../../entities/permission/permission.entity';
import { RolesEntity } from '../../../entities/roles/roles.entity';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([UsersEntity, PermissionsEntity, RolesEntity]),
      ],
      providers: [ProfilesService],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
