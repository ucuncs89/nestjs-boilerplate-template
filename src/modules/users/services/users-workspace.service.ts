import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UsersEntity } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';

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
    const findUsersDB = [];
    for (let i = 0; i < arrUsersWorkspace.length; i++) {
      findUsersDB[i] = await this.usersService.findUserByEmail(
        arrUsersWorkspace[i].email,
      );
      const email = arrUsersWorkspace[i].email;
      if (!findUsersDB[i]) {
        const insert = this.userRepository.create({
          email: arrUsersWorkspace[i].email.toLowerCase(),
          full_name: arrUsersWorkspace[i].full_name,
          is_active: arrUsersWorkspace[i].is_active,
          need_verification: true,
          is_forgot_password: false,
          created_by: 1,
          password: '',
          path_picture: arrUsersWorkspace[i].profile_picture,
        });
        await this.userRepository.save(insert);
      }
      if (findUsersDB[i]) {
        await this.userRepository
          .createQueryBuilder()
          .update()
          .set({
            is_active: arrUsersWorkspace[i].is_active,
            full_name: arrUsersWorkspace.full_name,
            path_picture: arrUsersWorkspace[i].profile_picture,
          })
          .where('LOWER(email) = LOWER(:email)', { email })
          .execute();
      }
    }
    return true;
  }
}
