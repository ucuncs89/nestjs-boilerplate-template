import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserActivationDto } from '../dto/user-activation.dto';
import { UsersPasswordEntity } from 'src/entities/users/users_password.entity';
import { saltOrRounds } from 'src/constant/saltOrRounds';

@Injectable()
export class UsersActivationService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,

    @InjectRepository(UsersPasswordEntity)
    private userPasswordRepository: Repository<UsersPasswordEntity>,
  ) {}

  async activeNewPassword(userActivationDto: UserActivationDto, user_id, i18n) {
    const findUser = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!findUser) {
      throw new AppErrorNotFoundException(
        i18n.t('users.email_not_registered'),
        'email_not_registered',
      );
    }
    const findUserPassword = await this.userPasswordRepository.find({
      where: {
        user_id: user_id,
      },
      select: {
        user_id: true,
        password: true,
      },
    });
    const comparePasswordInUsers = await bcrypt.compare(
      userActivationDto.password,
      findUser.password,
    );
    if (comparePasswordInUsers) {
      throw new AppErrorException(i18n.t('auth.password_already_exist'));
    }
    if (findUserPassword.length > 0) {
      for (let i = 0; i < findUserPassword.length; i++) {
        const comparePassword = await bcrypt.compare(
          userActivationDto.password,
          findUserPassword[i].password,
        );
        if (comparePassword) {
          throw new AppErrorException(i18n.t('auth.password_already_exist'));
        }
      }
    }
    try {
      const passwordHash = await bcrypt.hash(
        userActivationDto.password,
        saltOrRounds,
      );
      findUser.password = passwordHash;
      findUser.updated_at = new Date().toISOString();
      findUser.updated_by = user_id;
      findUser.is_active = true;
      findUser.need_verification = false;
      findUser.is_forgot_password = false;
      await this.userRepository.save(findUser);

      const data = await this.userPasswordRepository.create({
        user_id: user_id,
        password: passwordHash,
      });
      await this.userPasswordRepository.save(data);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
