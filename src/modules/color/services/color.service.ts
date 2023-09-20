import { Injectable } from '@nestjs/common';
import { CreateColorDto } from '../dto/create-color.dto';
import { UpdateColorDto } from '../dto/update-color.dto';
import { ColorEntity } from 'src/entities/colors/color.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(ColorEntity)
    private colorRepository: Repository<ColorEntity>,
  ) {}

  async create(createColorDto: CreateColorDto, user_id, i18n) {
    const findByName = await this.findByName(createColorDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeColor();
    try {
      const data = this.colorRepository.create({
        code,
        name: createColorDto.name,
        color_code: createColorDto.color_code,
        created_by: user_id,
        created_at: new Date().toISOString(),
      });
      await this.colorRepository.save(data);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { page, page_size, sort_by, order_by, keyword } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'color_name':
        orderObj = {
          name: order_by,
        };
        break;
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
    const [result, total] = await this.colorRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        color_code: true,
      },
      where: [
        {
          name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
        },
        {
          color_code: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
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
    const data = await this.colorRepository.findOne({
      where: { id, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        code: true,
        color_code: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(id: number, updateColorDto: UpdateColorDto, user_id, i18n) {
    const color = await this.colorRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!color) {
      throw new AppErrorNotFoundException();
    }

    if (
      color.name.toLocaleLowerCase() !== updateColorDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(updateColorDto.name);
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    try {
      color.updated_at = new Date().toISOString();
      color.updated_by = user_id;
      color.name = updateColorDto.name;
      color.color_code = updateColorDto.color_code;
      this.colorRepository.save(color);
      return color;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const color = await this.colorRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!color) {
      throw new AppErrorNotFoundException();
    }
    try {
      color.deleted_at = new Date().toISOString();
      color.deleted_by = user_id;
      this.colorRepository.save(color);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async generateCodeColor() {
    const pad = '0000';
    try {
      const color = await this.colorRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = color[0] ? `${color[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByName(name: string) {
    const data = await this.colorRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
