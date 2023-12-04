import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { IsNull, Repository } from 'typeorm';
import { ProjectProductionShippingDto } from '../dto/project-production-shipping.dto';

@Injectable()
export class ProjectProductionShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,
  ) {}
  async createShipping(
    project_detail_id,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectProductionShippingDto,
        project_detail_id,
        created_at: new Date().toISOString(),
      });
      await this.projectShippingRepository.save(shipping);
      return shipping;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateShipping(
    shipping_id: number,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          shipping_cost: projectProductionShippingDto.shipping_cost,
          shipping_date: projectProductionShippingDto.shipping_date,
          shipping_name: projectProductionShippingDto.shipping_name,
          shipping_vendor_name:
            projectProductionShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: shipping_id, ...projectProductionShippingDto };
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
  async findByProjectDetailId(project_detail_id) {
    const shipping = await this.projectShippingRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return shipping;
  }
}
