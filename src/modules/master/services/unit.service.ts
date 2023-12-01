import { Injectable } from '@nestjs/common';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { UnitEntity } from 'src/entities/master/unit.entity';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(UnitEntity)
    private unitRepository: Repository<UnitEntity>,
  ) {}

  async create(payload: CreateUnitDto, user_id, i18n) {
    try {
      await this.unitRepository.save({
        ...payload,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      return true;
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
    const [result, total] = await this.unitRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: {
        name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
        deleted_at: IsNull(),
      },
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
    const data = await this.unitRepository.findOne({
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

  async update(id: number, updateUnitDto: UpdateUnitDto, user_id, i18n) {
    const unit = await this.unitRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!unit) {
      throw new AppErrorNotFoundException();
    }

    try {
      unit.updated_at = new Date().toISOString();
      unit.updated_by = user_id;
      unit.name = updateUnitDto.name;
      unit.code = updateUnitDto.code;

      this.unitRepository.save(unit);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const unit = await this.unitRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!unit) {
      throw new AppErrorNotFoundException();
    }
    try {
      unit.deleted_at = new Date().toISOString();
      unit.deleted_by = user_id;
      this.unitRepository.save(unit);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
