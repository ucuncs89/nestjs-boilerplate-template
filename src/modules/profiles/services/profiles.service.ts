import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/entities/roles/roles.entity';
import { UsersEntity } from 'src/entities/users/users.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,

    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async findMeRoles(role_id) {
    const data = await this.rolesRepository.find({
      select: {
        id: true,
        title: true,
      },
      where: {
        id: In(role_id),
      },
    });
    return data;
  }
  async findMe(user_id) {
    const data = await this.usersRepository.findOne({
      select: {
        id: true,
        email: true,
        full_name: true,
        is_active: true,
        base_path: true,
        path_picture: true,
        roles: {
          id: true,
          title: true,
        },
      },
      relations: {
        roles: true,
      },
      where: {
        id: user_id,
      },
    });
    return data;
  }
}
