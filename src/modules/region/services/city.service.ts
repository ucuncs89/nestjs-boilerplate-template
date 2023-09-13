import { Injectable } from '@nestjs/common';

import { ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { UpdateProvinceDto } from '../dto/update-province.dto';
import * as XLSX from 'xlsx';
import { CityEntity } from 'src/entities/master/city.entity';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
  ) {}

  async create(createCityDto: CreateCityDto, user_id, i18n) {
    try {
      const city = this.cityRepository.create({
        id: parseInt(createCityDto.code),
        name: createCityDto.name,
        code: createCityDto.code,
        province_id: createCityDto.province_id,
      });
      await this.cityRepository.save(city);
      return city;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { page, page_size, sort_by, order_by, keyword, province_id } = query;
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
    const [result, total] = await this.cityRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        province_id: true,
      },
      where: {
        name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
        province_id: province_id ? province_id : Not(IsNull()),
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
    const data = await this.cityRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async update(id: number, updateCityDto: UpdateCityDto, user_id, i18n) {
    const city = await this.findOne(id, i18n);

    try {
      city.name = updateCityDto.name;
      city.code = updateCityDto.code;
      city.id = parseInt(updateCityDto.code);
      city.province_id = updateCityDto.province_id;
      await this.cityRepository.save(city);
      return city;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async remove(id: number, user_id: number, i18n) {
    await this.findOne(id, i18n);
    try {
      const city = await this.cityRepository.delete({ id });
      return city;
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

    const city = this.cityRepository.create(data);
    await this.cityRepository.save(city);
    return city;
  }
  async findByName(name: string) {
    const data = await this.cityRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
    return data;
  }
}
