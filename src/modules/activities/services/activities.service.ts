import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { ActivitiesEntity } from 'src/entities/activities/activities.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  async create(CreateActivityDto: CreateActivityDto, user_id: number, i18n) {
    const code = await this.generateCodeVendor();
    try {
      const data = this.activitiesRepository.create({
        code,
        name: CreateActivityDto.name,
        created_by: user_id,
      });
      await this.activitiesRepository.save(data);
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
    const [result, total] = await this.activitiesRepository.findAndCount({
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
    const data = await this.activitiesRepository.findOne({
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
    updateActivityDto: UpdateActivityDto,
    user_id,
    i18n,
  ) {
    const activity = await this.activitiesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!activity) {
      throw new AppErrorNotFoundException();
    }
    try {
      activity.updated_at = new Date().toISOString();
      activity.updated_by = user_id;
      activity.name = updateActivityDto.name;
      this.activitiesRepository.save(activity);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const activity = await this.activitiesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!activity) {
      throw new AppErrorNotFoundException();
    }
    try {
      activity.deleted_at = new Date().toISOString();
      activity.deleted_by = user_id;
      this.activitiesRepository.save(activity);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeVendor() {
    const pad = '0000';
    try {
      const vendor = await this.activitiesRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = vendor[0] ? `${vendor[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }
}
