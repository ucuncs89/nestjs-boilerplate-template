import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { ProjectCostingVendorProductionDetailDto } from '../dto/project-costing-vendor-production.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';

@Injectable()
export class ProjectCostingVendorProductionService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,

    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    private connection: Connection,
  ) {}

  async findVendorProduction(project_id: number) {
    const data = await this.projectVendorProductionRepository.find({
      select: {
        id: true,
        project_id: true,
        activity_id: true,
        activity_name: true,
        percentage_of_loss: true,
        total_quantity: true,
        sub_total_price: true,
        // quantity_unit_required: true,
        vendor_production_detail: {
          id: true,
          price: true,
          quantity: true,
          quantity_unit: true,
          vendor_id: true,
          vendor_name: true,
          project_vendor_production_id: true,
          price_unit: true,
          total_price: true,
          start_date: true,
          end_date: true,
        },
      },
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: {
        vendor_production_detail: true,
      },
      order: {
        id: 'DESC',
      },
    });
    return data;
  }
  async findOneProductionActivty(project_id: number, activity_id: number) {
    const data = await this.projectVendorProductionRepository.findOne({
      where: { project_id, activity_id },
    });
    return data;
  }

  async createVendorProductionActivity(
    project_id,
    activity_id,
    activity_name,
    user_id,
    i18n,
  ) {
    try {
      const activity = this.projectVendorProductionRepository.create({
        activity_id,
        activity_name,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionRepository.save(activity);
      return activity;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorProduction(
    project_id,
    projectCostingVendorProductionDetailDto: ProjectCostingVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    let project_vendor_production_id;
    const findVendorProductionActivity = await this.findOneProductionActivty(
      project_id,
      projectCostingVendorProductionDetailDto.activity_id,
    );
    if (!findVendorProductionActivity) {
      const insert = await this.createVendorProductionActivity(
        project_id,
        projectCostingVendorProductionDetailDto.activity_id,
        projectCostingVendorProductionDetailDto.activity_name,
        user_id,
        i18n,
      );
      project_vendor_production_id = insert.id;
    } else {
      project_vendor_production_id = findVendorProductionActivity.id;
    }
    try {
      const vendor = this.projectVendorProductionDetailRepository.create({
        ...projectCostingVendorProductionDetailDto,
        project_vendor_production_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionDetailRepository.save(vendor);
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return vendor;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorProduction(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    projectCostingVendorProductionDetailDto: ProjectCostingVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      delete projectCostingVendorProductionDetailDto.activity_id;
      delete projectCostingVendorProductionDetailDto.activity_name;
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
          project_vendor_production_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectCostingVendorProductionDetailDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorProductionDetail(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    user_id: number,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.delete({
        project_vendor_production_id,
        id: project_vendor_production_detail_id,
      });
      this.updateTotalQuantitySubtotal(project_vendor_production_id);
      this.deleteIfNotExistActivity(project_vendor_production_id, user_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateTotalQuantitySubtotal(project_vendor_production_id) {
    const total_quantity =
      await this.projectVendorProductionDetailRepository.sum('quantity', {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      });
    const sumPrice = await this.projectVendorProductionDetailRepository.sum(
      'total_price',
      {
        project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    );
    const update = await this.projectVendorProductionRepository.update(
      {
        id: project_vendor_production_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      {
        total_quantity,
        sub_total_price: sumPrice,
      },
    );
    return update;
  }

  async findRecap(project_id: number) {
    const data = await this.projectVendorProductionRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        activity_id: true,
        activity_name: true,
        sub_total_price: true,
        total_quantity: true,
      },
    });
    return data;
  }
  async deleteIfNotExistActivity(
    vendor_production_id: number,
    user_id: number,
  ) {
    const vendorDetail =
      await this.projectVendorProductionDetailRepository.findOne({
        where: {
          project_vendor_production_id: vendor_production_id,
        },
      });
    if (!vendorDetail) {
      await this.projectVendorProductionRepository.delete({
        id: vendor_production_id,
      });
    }
    return true;
  }
  async findProductionCosting(project_id: number) {
    const data = await this.projectVendorProductionRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        planning_project_vendor_production_id: IsNull(),
        added_in_section: In([StatusProjectEnum.Costing]),
        vendor_production_detail: {
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      },
      relations: {
        vendor_production_detail: true,
      },
    });
    return data;
  }
}
