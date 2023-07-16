import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from '../../../entities/roles/roles.entity';
import { UsersEntity } from '../../../entities/users/users.entity';
import { In, Repository } from 'typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AppErrorException } from '../../../exceptions/app-exception';

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

  async updateProfile(updateProfileDto: UpdateProfileDto, user_id, i18n) {
    try {
      const user = await this.usersRepository.findOne({
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
      user.base_path = updateProfileDto.base_path;
      user.path_picture = updateProfileDto.path_picture;
      user.full_name = updateProfileDto.full_name;
      user.updated_at = new Date().toISOString();
      user.updated_by = user_id;
      return this.usersRepository.save(user);
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
