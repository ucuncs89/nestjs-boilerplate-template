import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectPlanningVendorProductionDetailDto } from '../dto/project-planning-vendor-production.dto';

@Injectable()
export class ProjectPlanningVendorProductionService {
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
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    let project_vendor_production_id;
    const findVendorProductionActivity = await this.findOneProductionActivty(
      project_id,
      projectPlanningVendorProductionDetailDto.activity_id,
    );
    if (!findVendorProductionActivity) {
      const insert = await this.createVendorProductionActivity(
        project_id,
        projectPlanningVendorProductionDetailDto.activity_id,
        projectPlanningVendorProductionDetailDto.activity_name,
        user_id,
        i18n,
      );
      project_vendor_production_id = insert.id;
    } else {
      project_vendor_production_id = findVendorProductionActivity.id;
    }
    try {
      const vendor = this.projectVendorProductionDetailRepository.create({
        ...projectPlanningVendorProductionDetailDto,
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
    projectPlanningVendorProductionDetailDto: ProjectPlanningVendorProductionDetailDto,
    user_id,
    i18n,
  ) {
    try {
      delete projectPlanningVendorProductionDetailDto.activity_id;
      delete projectPlanningVendorProductionDetailDto.activity_name;
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
          project_vendor_production_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          ...projectPlanningVendorProductionDetailDto,
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
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
      });
    if (!vendorDetail) {
      await this.projectVendorProductionRepository.update(
        {
          id: vendor_production_id,
        },
        {
          deleted_at: new Date().toISOString(),
          deleted_by: user_id,
        },
      );
    }
    return true;
  }
  async findProductionPlanning(project_id: number) {
    const data = await this.projectVendorProductionRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        planning_project_vendor_production_id: IsNull(),
        added_in_section: In([StatusProjectEnum.Planning]),
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
