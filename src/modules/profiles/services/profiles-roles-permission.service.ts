import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntity } from 'src/entities/permission/permission.entity';

import { AppErrorException } from 'src/exceptions/app-exception';
import { In, IsNull, Repository } from 'typeorm';

@Injectable()
export class ProfileRolesPermissionService {
  constructor(
    @InjectRepository(PermissionsEntity)
    private permissionRepository: Repository<PermissionsEntity>,
  ) {}

  async findAll(roles) {
    try {
      const data = await this.permissionRepository.find({
        select: {
          id: true,
          title: true,
          description: true,
          parent_id: true,
          details: {
            id: true,
            title: true,
            description: true,
            parent_id: true,
          },
        },
        relations: {
          details: true,
        },
        where: {
          parent_id: IsNull(),
          roles: { id: In(roles) },
          details: {
            roles: { id: In(roles) },
          },
        },
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findAllPermissionById(parent_id, roles) {
    const data = await this.permissionRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        parent_id: true,
      },
      where: {
        parent_id,
        roles: { id: In(roles) },
      },
    });
    return data;
  }
}
