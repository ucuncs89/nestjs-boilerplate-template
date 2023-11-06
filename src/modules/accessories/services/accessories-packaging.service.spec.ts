import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AccessoriesPackagingEntity } from '../../../entities/accessories/accessories_packaging.entity';
import { AccessoriesPackagingService } from './accessories-packaging.service';
import { CreateAccessoryPackagingDto } from '../dto/create-accessory-packaging.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';

describe('Accessories Packaging Service', () => {
  let service: AccessoriesPackagingService;
  let repository: Repository<AccessoriesPackagingEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessoriesPackagingService,
        {
          provide: getRepositoryToken(AccessoriesPackagingEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AccessoriesPackagingService>(
      AccessoriesPackagingService,
    );
    repository = module.get<Repository<AccessoriesPackagingEntity>>(
      getRepositoryToken(AccessoriesPackagingEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find entities', async () => {
    const data = [
      {
        id: 1,
        category: ['test'],
        code: '0001',
        created_at: new Date().toString(),
        created_by: 1,
        name: 'test',
        deleted_by: null,
        updated_by: null,
        deleted_at: null,
        updated_at: null,
      },
    ];
    const total_data = 1;
    jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue([data, total_data]);

    const result = await service.findAll({
      page: 1,
      page_size: 10,
    });

    expect(result).toEqual({ data, total_data });
  });

  describe('create', () => {
    it('should create accessory packaging', async () => {
      const createDto: CreateAccessoryPackagingDto = {
        name: 'Test Accessory',
        category: ['Category1', 'Category2'],
      };
      const user_id = 1;
      const i18n = 'en';

      // Mock the findByName method to return null, indicating no existing record
      jest.spyOn(service, 'findByName').mockResolvedValue(null);

      // Mock the generateCodeAccessoriesPackaging method
      jest
        .spyOn(service, 'generateCodeAccessroiesPackaging')
        .mockResolvedValue('TEST123');

      // Mock the repository create method
      const mockCreate = jest.fn();
      jest.spyOn(repository, 'create').mockImplementation(mockCreate);

      // Mock the repository save method
      const mockSave = jest.fn().mockResolvedValue({
        id: 1,
        code: 'TEST123',
        name: 'Test Accessory',
        category: ['Category1', 'Category2'],
        created_by: user_id,
        created_at: new Date().toISOString(),
      });
      jest.spyOn(repository, 'save').mockImplementation(mockSave);

      // Act
      const result = await service.create(createDto, user_id, i18n);

      // // Assert
      // expect(result).toBeDefined();
      // expect(result.id).toBe(1);
      // expect(result.code).toBe('TEST123');
      // expect(result.name).toBe('Test Accessory');
      // expect(result.category).toEqual(['Category1', 'Category2']);

      // Verify method calls
      expect(service.findByName).toHaveBeenCalledWith(createDto.name);
      expect(service.generateCodeAccessroiesPackaging).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith({
        code: 'TEST123',
        name: 'Test Accessory',
        category: ['Category1', 'Category2'],
        created_by: user_id,
        created_at: expect.any(String), // Checking if it's a string timestamp
      });
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find and return an entity by ID', async () => {
      // Arrange
      const entityId = 1;
      const expectedEntity: AccessoriesPackagingEntity = {
        id: entityId,
        name: 'TestEntity',
        code: 'ABC',
        category: ['A', 'B'],
        created_at: new Date().toISOString(),
        created_by: 1,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedEntity);

      // Act
      const result = await service.findOne(entityId, 'en');

      // Assert
      expect(result).toEqual(expectedEntity);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: entityId, deleted_at: IsNull() },
        select: { id: true, name: true, code: true, category: true },
      });
    });

    it('should throw AppErrorNotFoundException when entity is not found', async () => {
      // Arrange
      const entityId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act and Assert
      await expect(service.findOne(entityId, 'en')).rejects.toThrowError(
        AppErrorNotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: entityId, deleted_at: IsNull() },
        select: { id: true, name: true, code: true, category: true },
      });
    });
  });
  describe('update', () => {
    it('should update and return true when entity is found', async () => {
      // Arrange
      const entityId = 1;
      const existingEntity: AccessoriesPackagingEntity = {
        id: entityId,
        name: 'TestEntity',
        code: 'ABC',
        category: ['A', 'B'],
        created_at: new Date().toISOString(),
        created_by: 1,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
      };
      const updatedDto = { name: 'NewName', category: ['B', 'C'] };
      jest.spyOn(repository, 'createQueryBuilder');
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEntity);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...existingEntity, ...updatedDto });

      // Act
      const result = await service.update(
        entityId,
        updatedDto,
        'user123',
        'en',
      );

      // Assert
      expect(result).toBe(true);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: entityId, deleted_at: IsNull() },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingEntity,
        ...updatedDto,
      });
    });

    it('should throw AppErrorNotFoundException when entity is not found', async () => {
      // Arrange
      const entityId = 1;
      const updatedDto = { name: 'NewName', category: ['B', 'C'] };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Act and Assert
      await expect(
        service.update(entityId, updatedDto, 'user123', 'en'),
      ).rejects.toThrowError(AppErrorNotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: entityId, deleted_at: IsNull() },
      });
    });

    it('should throw AppErrorException when updated name already exists', async () => {
      // Arrange
      const entityId = 1;
      const existingEntity: AccessoriesPackagingEntity = {
        id: entityId,
        name: 'TestEntity',
        code: 'ABC',
        category: ['A', 'B'],
        created_at: new Date().toISOString(),
        created_by: 1,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
      };
      const updatedDto = { name: 'NewName', category: ['B', 'C'] };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEntity);
      jest.spyOn(service, 'findByName').mockResolvedValue({
        id: 2,
        name: 'NewName',
        code: 'ABC',
        category: ['A', 'B'],
        created_at: new Date().toISOString(),
        created_by: 1,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
      }); // Mock findByName to return an existing entity with the same name

      // Act and Assert
      await expect(
        service.update(entityId, updatedDto, 'user123', 'en'),
      ).rejects.toThrowError(AppErrorException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: entityId, deleted_at: IsNull() },
      });
      expect(service.findByName).toHaveBeenCalledWith('NewName');
    });
  });
});
