import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { DepartmentsEntity } from '../../../entities/departments/departments.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentsEntity)
    private departmentsRepository: Repository<DepartmentsEntity>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, user_id, i18n) {
    const findByName = await this.findByName(createDepartmentDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeDepartment();
    try {
      const data = this.departmentsRepository.create({
        code,
        name: createDepartmentDto.name,
        created_by: user_id,
        created_at: new Date().toISOString(),
      });
      await this.departmentsRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { page, page_size, sort_by, order_by, keyword } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'name':
        orderObj = {
          name: order_by,
        };
        break;
      case 'code':
        orderObj = {
          code: order_by,
        };
        break;
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.departmentsRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: [
        {
          name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
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

  async findOne(id: number, i18n) {
    const data = await this.departmentsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
    user_id,
    i18n,
  ) {
    const activity = await this.departmentsRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!activity) {
      throw new AppErrorNotFoundException();
    }

    if (
      activity.name.toLocaleLowerCase() !==
      updateDepartmentDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(updateDepartmentDto.name);
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    try {
      activity.updated_at = new Date().toISOString();
      activity.updated_by = user_id;
      activity.name = updateDepartmentDto.name;
      this.departmentsRepository.save(activity);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const activity = await this.departmentsRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!activity) {
      throw new AppErrorNotFoundException();
    }
    try {
      activity.deleted_at = new Date().toISOString();
      activity.deleted_by = user_id;
      this.departmentsRepository.save(activity);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeDepartment() {
    const pad = '0000';
    try {
      const departments = await this.departmentsRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = departments[0] ? `${departments[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByName(name: string) {
    const data = await this.departmentsRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
