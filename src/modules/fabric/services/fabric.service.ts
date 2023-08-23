import { Injectable } from '@nestjs/common';
import { CreateFabricDto } from '../dto/create-fabric.dto';
import { UpdateFabricDto } from '../dto/update-fabric.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { FabricEntity } from '../../../entities/fabric/fabric.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Raw, Repository } from 'typeorm';

@Injectable()
export class FabricService {
  constructor(
    @InjectRepository(FabricEntity)
    private fabricRepository: Repository<FabricEntity>,
  ) {}
  async create(createFabricDto: CreateFabricDto, user_id, i18n) {
    const findByName = await this.findByName(createFabricDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeFabric();
    const arrCategory = [...new Set(createFabricDto.category)];
    try {
      const data = this.fabricRepository.create({
        code,
        name: createFabricDto.name,
        category: arrCategory,
        created_by: user_id,
      });
      await this.fabricRepository.save(data);
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
    const [result, total] = await this.fabricRepository.findAndCount({
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
    });
    return {
      data: result,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.fabricRepository.findOne({
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
  async update(id: number, updateFabricDto: UpdateFabricDto, user_id, i18n) {
    const fabric = await this.fabricRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!fabric) {
      throw new AppErrorNotFoundException();
    }

    if (
      fabric.name.toLocaleLowerCase() !==
      updateFabricDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(updateFabricDto.name);
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    const arrCategory = [...new Set(updateFabricDto.category)];
    try {
      fabric.updated_at = new Date().toISOString();
      fabric.updated_by = user_id;
      fabric.name = updateFabricDto.name;
      fabric.category = arrCategory;
      this.fabricRepository.save(fabric);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const fabric = await this.fabricRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!fabric) {
      throw new AppErrorNotFoundException();
    }
    try {
      fabric.deleted_at = new Date().toISOString();
      fabric.deleted_by = user_id;
      this.fabricRepository.save(fabric);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeFabric() {
    const pad = '0000';
    try {
      const fabric = await this.fabricRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = fabric[0] ? `${fabric[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByName(name: string) {
    const data = await this.fabricRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
