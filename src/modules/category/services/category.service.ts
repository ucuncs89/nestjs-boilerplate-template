import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoriesEntity } from 'src/entities/categories/categories.entity';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
    private connection: Connection,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user_id, i18n) {
    const findByName = await this.findByName(createCategoryDto.name);
    if (findByName) {
      throw new AppErrorException('Already Exist');
    }
    const code = await this.generateCodeCategory();
    createCategoryDto.sub_category = createCategoryDto.sub_category.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.name === obj.name),
    );
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const category = await queryRunner.manager.insert(CategoriesEntity, {
        name: createCategoryDto.name,
        created_by: user_id,
        code,
      });
      for (const sub_category of createCategoryDto.sub_category) {
        sub_category.parent_id = category.raw[0].id;
      }

      await queryRunner.manager.insert(
        CategoriesEntity,
        createCategoryDto.sub_category,
      );
      await queryRunner.commitTransaction();
      return createCategoryDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
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
      case 'sub_category':
        orderObj = {
          sub_category: {
            id: order_by,
          },
        };
    }
    const [result, total] = await this.categoriesRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        sub_category: { id: true, name: true, parent_id: true },
        parent_id: true,
        created_at: true,
      },
      where: [
        {
          name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
          parent_id: IsNull(),
          sub_category: { deleted_at: IsNull() },
        },
        {
          sub_category: keyword
            ? { name: ILike(`%${keyword}%`), deleted_at: IsNull() }
            : { deleted_at: IsNull() },
          deleted_at: IsNull(),
          parent_id: IsNull(),
        },
      ],
      order: orderObj,
      take: page_size,
      skip: page,
      relations: {
        sub_category: true,
      },
    });
    return {
      data: result,
      total_data: total,
    };
  }

  async findOne(id: number, i18n) {
    const data = await this.categoriesRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        sub_category: { deleted_at: IsNull() },
      },
      select: {
        id: true,
        name: true,
        code: true,
        sub_category: { id: true, name: true },
      },
      relations: {
        sub_category: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    user_id,
    i18n,
  ) {
    const packaging = await this.categoriesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!packaging) {
      throw new AppErrorNotFoundException();
    }

    if (
      packaging.name.toLocaleLowerCase() !==
      updateCategoryDto.name.toLocaleLowerCase()
    ) {
      const findByName = await this.findByName(updateCategoryDto.name);
      if (findByName) {
        throw new AppErrorException('Already Exist');
      }
    }
    for (const sub_category of updateCategoryDto.sub_category) {
      sub_category.parent_id = id;
    }
    try {
      const category = await this.categoriesRepository.save({
        id: id,
        name: updateCategoryDto.name,
      });
      await this.categoriesRepository.update(
        { parent_id: id },
        { deleted_by: user_id, deleted_at: new Date().toISOString() },
      );
      for (const sub_category of updateCategoryDto.sub_category) {
        sub_category.deleted_at = null;
        sub_category.deleted_by = null;
      }
      const sub_category = await this.categoriesRepository.save(
        updateCategoryDto.sub_category,
      );
      return { ...category, sub_category };
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    const sewing = await this.categoriesRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!sewing) {
      throw new AppErrorNotFoundException();
    }
    try {
      sewing.deleted_at = new Date().toISOString();
      sewing.deleted_by = user_id;
      this.categoriesRepository.save(sewing);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeCategory() {
    const pad = '0000';
    try {
      const category = await this.categoriesRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = category[0] ? `${category[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findByName(name: string) {
    const data = await this.categoriesRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .andWhere('parent_id is null')
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
