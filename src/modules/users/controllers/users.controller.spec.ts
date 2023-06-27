import { Test, TestingModule } from '@nestjs/testing';
import { UsersManageController } from './users-manage.controller';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
  let controller: UsersManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersManageController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersManageController>(UsersManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
