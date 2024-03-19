import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { ProjectCostingShippingDto } from '../dto/project-costing-shipping.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectDetailCalculateEntity } from 'src/entities/project/project_detail_calculate.entity';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';

@Injectable()
export class ProjectCostingShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    @InjectRepository(ProjectDetailCalculateEntity)
    private projectDetailCalculateRepository: Repository<ProjectDetailCalculateEntity>,

    private connection: Connection,
  ) {}
  async createShipping(
    project_id,
    projectCostingShippingDto: ProjectCostingShippingDto,
    user_id,
    cost_per_item: number,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectCostingShippingDto,
        added_in_section: StatusProjectEnum.Costing,
        shipping_cost: cost_per_item,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectShippingRepository.save(shipping);
      return shipping;
    } catch (error) {
      console.log(error);

      throw new AppErrorException(error);
    }
  }
  async updateShipping(
    shipping_id: number,
    projectCostingShippingDto: ProjectCostingShippingDto,
    user_id: number,
    cost_per_item: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          total_shipping_cost: projectCostingShippingDto.total_shipping_cost,
          shipping_cost: cost_per_item,
          shipping_date: projectCostingShippingDto.shipping_date,
          shipping_name: projectCostingShippingDto.shipping_name,
          shipping_vendor_name: projectCostingShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: shipping_id, ...projectCostingShippingDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailShipping(shipping_id: number) {
    const data = await this.projectShippingRepository.findOne({
      where: {
        id: shipping_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deleteShipping(shipping_id) {
    return await this.projectShippingRepository.delete({ id: shipping_id });
  }
  async findByProjectDetailId(project_id) {
    const shipping = await this.projectShippingRepository.find({
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        total_shipping_cost: true,
        created_at: true,
      },
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return shipping;
  }
  async findShippingCosting(project_id: number) {
    const data = await this.projectShippingRepository.find({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        planning_project_shipping_id: IsNull(),
      },
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        added_in_section: true,
        total_shipping_cost: true,
      },
    });
    return data;
  }
  async updateGrandAvgPriceTotalShipping(project_id: number) {
    const avgPrice = await this.projectShippingRepository.average(
      'total_shipping_cost',
      {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: StatusProjectEnum.Costing,
      },
    );
    const data = await this.projectDetailCalculateRepository.upsert(
      {
        project_id,
        type: TypeProjectDetailCalculateEnum.Shipping,
        added_in_section: StatusProjectEnum.Costing,
        avg_price: avgPrice,
      },
      {
        conflictPaths: { project_id: true, type: true, added_in_section: true },
      },
    );
    return data;
  }
}
