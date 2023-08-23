import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRolesEntity } from '../../entities/users/users_roles.entity';
import { AppErrorForbiddenException } from '../../exceptions/app-exception';
import { In, Repository } from 'typeorm';
import { Role } from './enum/role.enum';

@Injectable()
export class RolesPermissionGuard {
  constructor(
    @InjectRepository(UsersRolesEntity)
    private usersRolesRepository: Repository<UsersRolesEntity>,
  ) {}

  async canActionByRoles(user_id: number, arrRoles: Role[]) {
    const data = await this.usersRolesRepository.findOne({
      where: { user_id: user_id, role_id: In(arrRoles) },
      select: { role_id: true, user_id: true },
    });
    if (!data) {
      throw new AppErrorForbiddenException();
    }
    return true;
  }
}
