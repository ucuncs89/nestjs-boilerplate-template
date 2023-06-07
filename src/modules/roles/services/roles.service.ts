import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/entities/roles/roles.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
  ) {}

  async create(payload, user_id) {
    try {
      const insert = this.rolesRepository.create({
        title: payload.title,
        description: payload.description,
        created_by: user_id,
      });
      await this.rolesRepository.save(insert);
      return insert;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { search, page_size, page } = query;
    const roles = await this.rolesRepository
      .createQueryBuilder('roles')
      .select(['roles.id', 'roles.title', 'roles.description'])
      .where(
        `CONCAT( 
        roles.title, 
        roles.description     
      ) ${search ? `ILIKE '%${search}%'` : `is not null`}`,
      )
      .andWhere('roles.deleted_by is null')
      .take(page_size)
      .skip(page)
      .getMany();
    const total_data = await this.rolesRepository
      .createQueryBuilder('roles')
      .select(['roles.id', 'roles.title', 'roles.description'])
      .where(
        `CONCAT( 
      roles.title, 
      roles.description     
    ) ${search ? `ILIKE '%${search}%'` : `is not null`}`,
      )
      .andWhere('roles.deleted_by is null')
      .getCount();
    return { result: roles, total_data };
  }

  async findOne(id: number) {
    const data = await this.rolesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!data) {
      throw new AppErrorNotFoundException('roles id not found');
    }
    return data;
  }

  async update(id: number, payload, user_id) {
    const roles = await this.rolesRepository.findOne({ where: { id } });
    if (!roles) {
      throw new AppErrorNotFoundException('roles id not found');
    }
    roles.title = payload.title;
    roles.description = payload.description;
    roles.updated_at = new Date().toISOString();
    roles.updated_by = user_id;
    return await this.rolesRepository.save(roles);
  }

  async remove(id: number, user_id) {
    const roles = await this.rolesRepository.findOne({ where: { id } });
    if (!roles) {
      throw new AppErrorNotFoundException('roles id not found');
    }
    roles.deleted_by = user_id;
    roles.deleted_at = new Date().toISOString();
    await this.rolesRepository.save(roles);
    return true;
  }
}
