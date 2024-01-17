import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingRecapService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}
  async calculateRecap(
    listFabricItem?: any[],
    listSewingItem?: any[],
    listPackagingItem?: any[],
    listFinishedGoodsItem?: any[],
  ) {
    const fabric = await this.calculateMaterialRecap(listFabricItem);
    const sewing = await this.calculateMaterialRecap(listSewingItem);
    const packaging = await this.calculateMaterialRecap(listPackagingItem);
    const finishedgoods = await this.calculateMaterialRecap(
      listFinishedGoodsItem,
    );
    return { fabric, sewing, packaging };
  }

  async calculateMaterialRecap(listMaterialItem: any[]) {
    const arrResult = [];
    if (listMaterialItem.length < 1) {
      return { detail: arrResult, total_cost: 0 };
    }
    for (const item of listMaterialItem) {
      const total_avg = item.avg_price * item.consumption;
      const allowPrice = (item.allowance / 100) * total_avg;
      arrResult.push({
        ...item,
        allowPrice,
        material_cost: allowPrice + total_avg,
      });
    }
    const total_cost = arrResult.reduce(
      (total, item) => total + item.material_cost,
      0,
    );
    return { detail: arrResult, total_cost };
  }
}
