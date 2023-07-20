import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRolesEntity } from 'src/entities/users/users_roles.entity';
import { AppErrorForbiddenException } from 'src/exceptions/app-exception';
import { In, Repository } from 'typeorm';
import { Role } from './enum/role.enum';

@Injectable()
export class RolesPermissionGuard {
  constructor(
    @InjectRepository(UsersRolesEntity)
    private usersRolesRepository: Repository<UsersRolesEntity>,
  ) {}

  async canDeleteByRoles(user_id: number, arrRoles: Role[]) {
    const data = await this.usersRolesRepository.findOne({
      where: { user_id: user_id, role_id: In(arrRoles) },
      select: { role_id: true, user_id: true },
    });
    if (!data) {
      throw new AppErrorForbiddenException();
    }
    return false;
  }
}
