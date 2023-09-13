import { Injectable } from '@nestjs/common';

import { ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProvinceEntity } from 'src/entities/master/province.entity';
import { CreateProvinceDto } from '../dto/create-province.dto';
import { UpdateProvinceDto } from '../dto/update-province.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(ProvinceEntity)
    private provinceRepository: Repository<ProvinceEntity>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto, user_id, i18n) {
    try {
      const province = this.provinceRepository.create({
        id: parseInt(createProvinceDto.code),
        name: createProvinceDto.name,
        code: createProvinceDto.code,
      });
      await this.provinceRepository.save(province);
      return province;
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
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.provinceRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
      },
      where: {
        name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
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
    const data = await this.provinceRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
    user_id,
    i18n,
  ) {
    const province = await this.findOne(id, i18n);

    try {
      province.name = updateProvinceDto.name;
      province.code = updateProvinceDto.code;
      province.id = parseInt(updateProvinceDto.code);
      await this.provinceRepository.save(province);
      return province;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    await this.findOne(id, i18n);
    try {
      const province = await this.provinceRepository.delete({ id });
      return province;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async importExcel(payload) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to an array of objects
    const data = XLSX.utils.sheet_to_json(sheet);

    const province = this.provinceRepository.create(data);
    await this.provinceRepository.save(province);
    return province;
  }

  async findByName(name: string) {
    const data = await this.provinceRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
    return data;
  }
}
