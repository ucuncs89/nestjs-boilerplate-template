import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { ActivitiesEntity } from '../../../entities/activities/activities.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from '../../../config/database.config';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConnectionService,
        }),
        TypeOrmModule.forFeature([ActivitiesEntity]),
      ],
      providers: [ActivitiesService],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
