import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CostEntity } from 'src/entities/master/cost.entity';
import { GetListCostDto } from '../dto/get-list-cost.dto';

@Injectable()
export class CostService {
  constructor(
    @InjectRepository(CostEntity)
    private costRepository: Repository<CostEntity>,
  ) {}

  async findAll(query: GetListCostDto) {
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
    const [result, total] = await this.costRepository.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
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
}
