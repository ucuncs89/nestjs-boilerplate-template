import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { ProjectCostingVendorProductionDetailDto } from '../dto/project-costing-vendor-production.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectDetailCalculateEntity } from 'src/entities/project/project_detail_calculate.entity';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';

@Injectable()
export class ProjectCostingVendorProductionService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,

    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    @InjectRepository(ProjectDetailCalculateEntity)
    private projectDetailCalculateRepository: Repository<ProjectDetailCalculateEntity>,

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
        added_in_section: In([StatusProjectEnum.Costing]),
        vendor_production_detail: {
          added_in_section: In([StatusProjectEnum.Costing]),
        },
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
      where: {
        project_id,
        activity_id,
        added_in_section: StatusProjectEnum.Costing,
      },
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
        added_in_section: StatusProjectEnum.Costing,
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
        added_in_section: StatusProjectEnum.Costing,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorProductionDetailRepository.save(vendor);
      await this.updateTotalQuantitySubtotal(project_vendor_production_id);
      await this.updateGrandTotalProductionPerProject(project_id);
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
    project_id,
  ) {
    try {
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

        projectCostingVendorProductionDetailDto.project_vendor_production_id =
          insert.id;
      } else {
        projectCostingVendorProductionDetailDto.project_vendor_production_id =
          findVendorProductionActivity.id;
      }

      delete projectCostingVendorProductionDetailDto.activity_id;
      delete projectCostingVendorProductionDetailDto.activity_name;
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: project_vendor_production_detail_id,
        },
        {
          ...projectCostingVendorProductionDetailDto,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      await this.updateTotalQuantitySubtotal(project_vendor_production_id);
      await this.updateGrandTotalProductionPerProject(project_id);
      await this.deleteIfNotExistActivity(
        project_vendor_production_id,
        user_id,
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorProductionDetail(
    project_vendor_production_id: number,
    project_vendor_production_detail_id: number,
    user_id: number,
    project_id: number,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.delete({
        project_vendor_production_id,
        id: project_vendor_production_detail_id,
      });
      await this.updateTotalQuantitySubtotal(project_vendor_production_id);
      await this.deleteIfNotExistActivity(
        project_vendor_production_id,
        user_id,
      );
      await this.updateGrandTotalProductionPerProject(project_id);
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
        added_in_section: In([StatusProjectEnum.Planning]),
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
  async updateGrandTotalProductionPerProject(project_id: number) {
    const sumTotalPrice: number =
      await this.projectVendorProductionRepository.sum('sub_total_price', {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        sub_total_price: Not(IsNull()),
      });
    const sumTotalQuantity: number =
      await this.projectVendorProductionRepository.sum('total_quantity', {
        project_id,
        added_in_section: In([StatusProjectEnum.Costing]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        total_quantity: Not(IsNull()),
      });
    const avgPrice = sumTotalPrice / sumTotalQuantity;
    const data = await this.projectDetailCalculateRepository.upsert(
      {
        project_id,
        type: TypeProjectDetailCalculateEnum.Production,
        added_in_section: StatusProjectEnum.Costing,
        total_price: sumTotalPrice,
        avg_price: avgPrice,
      },
      {
        conflictPaths: { project_id: true, type: true, added_in_section: true },
      },
    );

    return data;
  }
}
