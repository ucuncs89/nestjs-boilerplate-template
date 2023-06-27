import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { UsersRolesEntity } from 'src/entities/users/users_roles.entity';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,

    private jwtService: JwtService,
    @Inject('cloami_rmq') private client: ClientProxy,

    private connection: Connection,
  ) {}

  async createUser(createUserDto: CreateUserDto, user_id, i18n) {
    const findUserByEmail = await this.findUserByEmail(createUserDto.email);
    if (findUserByEmail) {
      throw new AppErrorException(
        i18n.t('users.email_alredy_registered'),
        'email_alredy_registered',
      );
    }
    const arrRoles = [];
    if (createUserDto.roles.length > 0) {
      createUserDto.roles.forEach((v) => {
        arrRoles.push({ id: v });
      });
    }

    try {
      const insert = this.userRepository.create({
        email: createUserDto.email.toLowerCase(),
        full_name: createUserDto.full_name,
        is_active: false,
        need_verification: true,
        is_forgot_password: true,
        roles: arrRoles,
        created_by: user_id,
        password: '',
      });
      await this.userRepository.save(insert);
      const payloadJwt = {
        id: insert.id,
        uuid: insert.uuid,
      };
      const token = await this.jwtService.sign(payloadJwt, {
        secret: env.JWT_SECRET_KEY,
      });
      this.client.emit('send-email-create-user', {
        full_name: insert.full_name,
        email: insert.email,
        token,
      });
      return true;
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }

  async findUserByEmail(email) {
    return await this.userRepository
      .createQueryBuilder()
      .where('LOWER(email) = LOWER(:email)', { email })
      .getOne();
  }

  async findAll(query) {
    const { keywoard, page_size, page, roles, order_by, sort_by } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'full_name':
        orderObj = {
          full_name: order_by,
        };
        break;
      case 'email':
        orderObj = {
          email: order_by,
        };
        break;
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
      default:
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.userRepository.findAndCount({
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        need_verification: true,
        roles: { id: true, title: true },
      },
      where: [
        {
          full_name: keywoard ? ILike(`%${keywoard}%`) : Not(IsNull()),
          roles: { id: roles ? roles : Not(IsNull()) },
          deleted_at: IsNull(),
        },
        {
          email: keywoard ? ILike(`%${keywoard}%`) : Not(IsNull()),
          roles: { id: roles ? roles : Not(IsNull()) },
          deleted_at: IsNull(),
        },
      ],
      order: orderObj,
      relations: { roles: true },
      take: page_size,
      skip: page,
    });
    return {
      data: result,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.userRepository.findOne({
      where: [
        {
          id,
        },
        { deleted_at: null },
      ],
      select: {
        id: true,
        full_name: true,
        email: true,
        deleted_at: true,
        roles: { id: true, title: true },
      },
      relations: { roles: true },
    });

    if (!data) {
      throw new AppErrorNotFoundException(
        i18n.t('users.user_not_found'),
        'user_not_found',
      );
    }
    if (data.deleted_at !== null) {
      throw new AppErrorNotFoundException(
        i18n.t('users.user_not_found'),
        'user_not_found',
      );
    }
    return data;
  }

  async remove(id: number, user_id: number, i18n) {
    const data = await this.userRepository.findOne({ where: { id } });
    if (!data) {
      throw new AppErrorNotFoundException(
        i18n.t('users.user_not_found'),
        'user_not_found',
      );
    }
    data.deleted_at = new Date().toISOString();
    data.deleted_by = user_id;
    return this.userRepository.save(data);
  }

  async update(payload, i18n) {
    const { id, roles, email, full_name, user_id } = payload;
    const arrRoles = [];
    if (roles.length > 0) {
      roles.forEach((v) => {
        arrRoles.push({ role_id: v, user_id: id });
      });
    }
    const queryRunner = this.connection.createQueryRunner();
    await this.findOne(id, i18n);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(UsersEntity, id, {
        email: email,
        full_name: full_name,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      });
      await queryRunner.manager.delete(UsersRolesEntity, { user_id: id });
      await queryRunner.manager.insert(UsersRolesEntity, arrRoles);
      await queryRunner.commitTransaction();
      return payload;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async activationByAdmin(payload, i18n) {
    const { id, is_active, user_id } = payload;
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user.password === '') {
      throw new AppErrorException('the user has not set a password');
    }
    user.is_active = is_active;
    user.need_verification = !is_active;
    user.updated_at = new Date().toISOString();
    user.updated_by = user_id;
    this.userRepository.save(user);
    return {
      id,
      is_active,
      email: user.email,
      need_verification: user.need_verification,
    };
  }
}
