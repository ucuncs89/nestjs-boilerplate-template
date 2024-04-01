import { Injectable } from '@nestjs/common';
import { CreateAccessoryPackagingDto } from '../dto/create-accessory-packaging.dto';
import { UpdateAccessoryPackagingDto } from '../dto/update-accessory-packaging.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessoriesPackagingEntity } from '../../../entities/accessories/accessories_packaging.entity';
import { ILike, IsNull, Not, Raw, Repository } from 'typeorm';

@Injectable()
export class AccessoriesPackagingService {
  constructor(
    @InjectRepository(AccessoriesPackagingEntity)
    private accessoriesPackagingRepository: Repository<AccessoriesPackagingEntity>,
  ) {}

  async create(
    createAccessoryPackagingDto: CreateAccessoryPackagingDto,
    user_id,
    i18n,
  ) {
    const findByName = await this.findByName(createAccessoryPackagingDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeAccessroiesPackaging();
    const arrCategory = [...new Set(createAccessoryPackagingDto.category)];
    const arrUnitOfMeasure = [
      ...new Set(createAccessoryPackagingDto.unit_of_measure),
    ];
    try {
      const data = this.accessoriesPackagingRepository.create({
        code,
        name: createAccessoryPackagingDto.name,
        category: arrCategory,
        created_by: user_id,
        created_at: new Date().toISOString(),
        unit_of_measure: arrUnitOfMeasure,
      });
      await this.accessoriesPackagingRepository.save(data);
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
    const [result, total] =
      await this.accessoriesPackagingRepository.findAndCount({
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
          unit_of_measure: true,
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
      });
    return {
      data: result,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.accessoriesPackagingRepository.findOne({
      where: { id, deleted_at: IsNull() },
      select: {
        id: true,
        name: true,
        code: true,
        category: true,
        unit_of_measure: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(
    id: number,
    updateAccessoryPackagingDto: UpdateAccessoryPackagingDto,
    user_id,
    i18n,
  ) {
    const packaging = await this.accessoriesPackagingRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!packaging) {
      throw new AppErrorNotFoundException();
    }

    if (
      packaging.name.toLocaleLowerCase() !==
      updateAccessoryPackagingDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(
        updateAccessoryPackagingDto.name,
      );
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    const arrCategory = [...new Set(updateAccessoryPackagingDto.category)];
    const arrUnitOfMeasure = [
      ...new Set(updateAccessoryPackagingDto.unit_of_measure),
    ];
    try {
      packaging.updated_at = new Date().toISOString();
      packaging.updated_by = user_id;
      packaging.name = updateAccessoryPackagingDto.name;
      packaging.category = arrCategory;
      packaging.unit_of_measure = arrUnitOfMeasure;
      await this.accessoriesPackagingRepository.save(packaging);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const packaging = await this.accessoriesPackagingRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!packaging) {
      throw new AppErrorNotFoundException();
    }
    try {
      packaging.deleted_at = new Date().toISOString();
      packaging.deleted_by = user_id;
      this.accessoriesPackagingRepository.save(packaging);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async generateCodeAccessroiesPackaging() {
    const pad = '0000';
    try {
      const packaging = await this.accessoriesPackagingRepository.find({
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
    const data = await this.accessoriesPackagingRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
