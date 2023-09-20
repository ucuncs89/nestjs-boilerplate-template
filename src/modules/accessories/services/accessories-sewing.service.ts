import { Injectable } from '@nestjs/common';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { AccessoriesSewingEntity } from 'src/entities/accessories/accessories_sewing.entity';
import { CreateAccessorySewingDto } from '../dto/create-accessory-sewing.dto';
import { UpdateAccessorySewingDto } from '../dto/update-accessory-sewing.dto';

@Injectable()
export class AccessoriesSewingService {
  constructor(
    @InjectRepository(AccessoriesSewingEntity)
    private accessoriesSewingRepository: Repository<AccessoriesSewingEntity>,
  ) {}

  async create(
    createAccessorySewingDto: CreateAccessorySewingDto,
    user_id,
    i18n,
  ) {
    const findByName = await this.findByName(createAccessorySewingDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeAccessroiesSewing();
    const arrCategory = [...new Set(createAccessorySewingDto.category)];
    try {
      const data = this.accessoriesSewingRepository.create({
        code,
        name: createAccessorySewingDto.name,
        category: arrCategory,
        created_by: user_id,
        created_at: new Date().toISOString(),
      });
      await this.accessoriesSewingRepository.save(data);
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
    const [result, total] = await this.accessoriesSewingRepository.findAndCount(
      {
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
        },
        where: [
          {
            name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
            deleted_at: IsNull(),
          },
          {
            category: keyword
              ? Raw(() => `:keyword = ANY (category)`, {
                  keyword,
                })
              : Not(IsNull()),

            deleted_at: IsNull(),
          },
        ],
        order: orderObj,
        take: page_size,
        skip: page,
      },
    );
    return {
      data: result,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.accessoriesSewingRepository.findOne({
      where: { id, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(
    id: number,
    updateAccessorySewingDto: UpdateAccessorySewingDto,
    user_id,
    i18n,
  ) {
    const sewing = await this.accessoriesSewingRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!sewing) {
      throw new AppErrorNotFoundException();
    }

    if (
      sewing.name.toLocaleLowerCase() !==
      updateAccessorySewingDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(updateAccessorySewingDto.name);
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    const arrCategory = [...new Set(updateAccessorySewingDto.category)];
    try {
      sewing.updated_at = new Date().toISOString();
      sewing.updated_by = user_id;
      sewing.name = updateAccessorySewingDto.name;
      sewing.category = arrCategory;
      this.accessoriesSewingRepository.save(sewing);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const sewing = await this.accessoriesSewingRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!sewing) {
      throw new AppErrorNotFoundException();
    }
    try {
      sewing.deleted_at = new Date().toISOString();
      sewing.deleted_by = user_id;
      this.accessoriesSewingRepository.save(sewing);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async generateCodeAccessroiesSewing() {
    const pad = '0000';
    try {
      const packaging = await this.accessoriesSewingRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = packaging[0] ? `${packaging[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByName(name: string) {
    const data = await this.accessoriesSewingRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
