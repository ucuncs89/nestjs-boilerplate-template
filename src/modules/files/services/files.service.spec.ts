import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FilesEntity } from '../../../entities/master/files.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([FilesEntity])],
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(FilesEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
