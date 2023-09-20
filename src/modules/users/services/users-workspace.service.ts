import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UsersEntity } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class UsersWorkspaceService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,

    private usersService: UsersService,
  ) {}

  async findUsersWorkspace() {
    const response = await axios({
      method: 'GET',
      url: `https://list.cloami.com/users.php`,
    });
    return response.data;
  }

  async syncData(arrUsersWorkspace) {
    for (let i = 0; i < arrUsersWorkspace.length; i++) {
      const findUsersDB = await this.usersService.findUserByEmail(
        arrUsersWorkspace[i].email,
      );
      const email = arrUsersWorkspace[i].email;

      try {
        if (!findUsersDB) {
          const insert = this.userRepository.create({
            email: arrUsersWorkspace[i].email.toLowerCase(),
            full_name: arrUsersWorkspace[i].full_name,
            is_active: arrUsersWorkspace[i].is_active,
            need_verification: false,
            is_forgot_password: false,
            created_by: 1,
            password: '',
            path_picture: arrUsersWorkspace[i].profile_picture,
            created_at: new Date().toISOString(),
          });
          await this.userRepository.save(insert);
        }
        if (findUsersDB) {
          await this.userRepository
            .createQueryBuilder()
            .update()
            .set({
              is_active: arrUsersWorkspace[i].is_active,
              full_name: arrUsersWorkspace.full_name,
              path_picture: arrUsersWorkspace[i].profile_picture,
              updated_at: new Date().toISOString(),
            })
            .where('LOWER(email) = LOWER(:email)', { email })
            .execute();
        }
      } catch (error) {
        throw new AppErrorException(error);
      }
    }
    return true;
  }
}
