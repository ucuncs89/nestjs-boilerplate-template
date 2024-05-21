import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../../../entities/users/users.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { Connection, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { UsersRolesEntity } from '../../../entities/users/users_roles.entity';
import { GetUserListDto } from '../dto/get-user-list.dto';
import { UserTokenDto } from '../dto/user-token.dto';
import { UsersTokenEntity } from 'src/entities/users/users_token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,

    @InjectRepository(UsersTokenEntity)
    private userTokenRepository: Repository<UsersTokenEntity>,

    private jwtService: JwtService,

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
        is_active: true,
        need_verification: true,
        is_forgot_password: true,
        roles: arrRoles,
        created_by: user_id,
        password: '',
        created_at: new Date().toISOString(),
      });
      await this.userRepository.save(insert);
      const payloadJwt = {
        id: insert.id,
        uuid: insert.uuid,
      };
      const token = await this.jwtService.sign(payloadJwt, {
        secret: env.JWT_SECRET_KEY,
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
    const { keywoard, page_size, page, roles, order_by, sort_by, is_active } =
      query;
    let orderObj = {};
    let active: any;
    switch (is_active) {
      case 'true':
        active = true;
        break;
      case 'false':
        active = false;
        break;
      default:
        active = [];
        break;
    }
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
      case 'status':
        orderObj = {
          is_active: order_by,
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
          roles: { id: roles ? roles : Not(In([])) },
          deleted_at: IsNull(),
          is_active: is_active ? active : Not(In(active)),
        },
        {
          email: keywoard ? ILike(`%${keywoard}%`) : Not(IsNull()),
          roles: { id: roles ? roles : Not(In([])) },
          deleted_at: IsNull(),
          is_active: is_active ? active : Not(In(active)),
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

  async updateStatusActiveUser(email: string) {
    const user = await this.findUserByEmail(email);
    user.is_active = false;
    return await this.userRepository.save(user);
  }

  async findUserList(query: GetUserListDto) {
    const { keyword, page_size, page, order_by, sort_by } = query;
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
      case 'status':
        orderObj = {
          is_active: order_by,
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
        base_path: true,
        path_picture: true,
      },
      where: [
        {
          full_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          is_active: true,
          deleted_at: IsNull(),
        },
        {
          email: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          is_active: true,
          deleted_at: IsNull(),
        },
      ],
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      data: result,
      total_data: total,
    };
  }

  async createUpdateUserToken(user_id, userTokenDto: UserTokenDto) {
    const userToken = await this.userTokenRepository.findOne({
      where: { token: userTokenDto.token },
    });
    if (!userToken) {
      const token = this.userTokenRepository.create({
        user_id,
        token: userTokenDto.token,
        created_at: new Date().toISOString(),
      });
      await this.userTokenRepository.save(token);
      return token;
    }
    userToken.user_id = user_id;
    userToken.created_at = new Date().toISOString();
    this.userRepository.save(userToken);
    return userToken;
  }
  async logoutDeleteUserToken(user_id, userTokenDto: UserTokenDto) {
    const data = await this.userTokenRepository.delete({
      user_id,
      token: userTokenDto.token,
    });
    return data;
  }
}
