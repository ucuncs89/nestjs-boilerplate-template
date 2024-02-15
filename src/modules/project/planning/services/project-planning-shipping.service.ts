import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningShippingDto } from '../dto/project-planning-shipping.dto';

@Injectable()
export class ProjectPlanningShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    private connection: Connection,
  ) {}
  async createShipping(
    project_id,
    projectPlanningShippingDto: ProjectPlanningShippingDto,
    user_id,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectPlanningShippingDto,
        added_in_section: StatusProjectEnum.Planning,
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
    projectPlanningShippingDto: ProjectPlanningShippingDto,
    user_id: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          shipping_cost: projectPlanningShippingDto.shipping_cost,
          shipping_date: projectPlanningShippingDto.shipping_date,
          shipping_name: projectPlanningShippingDto.shipping_name,
          shipping_vendor_name: projectPlanningShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: shipping_id, ...projectPlanningShippingDto };
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
        created_at: true,
      },
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return shipping;
  }
  async findShippingPlanning(project_id: number) {
    const data = await this.projectShippingRepository.find({
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
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
      },
    });
    return data;
  }

  async findCompareByProjectDetailId(project_id: number) {
    const costing = await this.projectShippingRepository.find({
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        created_at: true,
      },
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const planning = await this.projectShippingRepository.find({
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        created_at: true,
      },
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Planning]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return { costing, planning };
  }
  async sumGrandAvgPriceTotalShipping(project_id: number) {
    const avgPrice = await this.projectShippingRepository.average(
      'shipping_cost',
      {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: StatusProjectEnum.Planning,
      },
    );
    const totalCost = await this.projectShippingRepository.sum(
      'shipping_cost',
      {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        added_in_section: StatusProjectEnum.Planning,
      },
    );
    return {
      avg_price: avgPrice ? avgPrice : 0,
      total_cost: totalCost ? totalCost : 0,
    };
  }
}
