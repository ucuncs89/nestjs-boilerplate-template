import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ProjectShippingProductionDto } from '../dto/project-shipping-production.dto';

@Injectable()
export class ProjectShippingProductionService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    private connection: Connection,
  ) {}
  async createShipping(
    project_detail_id,
    projectShippingProductionDto: ProjectShippingProductionDto,
    user_id,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectShippingProductionDto,
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
    projectShippingProductionDto: ProjectShippingProductionDto,
    user_id: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          shipping_cost: projectShippingProductionDto.shipping_cost,
          shipping_date: projectShippingProductionDto.shipping_date,
          shipping_name: projectShippingProductionDto.shipping_name,
          shipping_vendor_name:
            projectShippingProductionDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return { id: shipping_id, ...projectShippingProductionDto };
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
