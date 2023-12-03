import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, IsNull, Repository } from 'typeorm';

import {
  CreateProjectDetailDto,
  StatusProjectDetailEnum,
  TypepProjectDetailEnum,
} from '../dto/create-project-detail.dto';
import { StatusProjectHistoryEnum } from '../dto/create-project-history.dto';
import { ProjectService } from './project.service';
import { ProjectHistoryService } from './project-history.service';
import { ProjectPlanningConfirmDto } from '../../planning/dto/project-planning-confirm.dto';
import { ProjectPlanningMaterialService } from '../../planning/services/project-planning-material.service';
import { ProjectPlanningVariantService } from '../../planning/services/project-planning-variant.service';
import { ProjectSamplingConfirmDto } from '../../sampling/dto/project-sampling-confirm.dto';
import { ProjectPlanningVendorProductionService } from '../../planning/services/project-planning-vendor-production.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class ProjectDetailService {
  constructor(
    @InjectRepository(ProjectDetailEntity)
    private projectDetailRepository: Repository<ProjectDetailEntity>,
    private projectHistoryService: ProjectHistoryService,
    private projectService: ProjectService,
    private projectPlanningMaterialService: ProjectPlanningMaterialService,
    private projectPlanningVariantService: ProjectPlanningVariantService,
    private projectPlanningVendorProductionService: ProjectPlanningVendorProductionService,

    private connection: Connection,
  ) {}

  async createProjectDetailPlanning(
    project_id,
    createProjectDetailDto: CreateProjectDetailDto,
    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Planning',
      },
    });
    if (!data) {
      const data = this.projectDetailRepository.create({
        ...createProjectDetailDto,
        created_at: new Date().toISOString(),
        created_by: user_id,
        project_id,
      });
      await this.projectDetailRepository.save(data);
      this.projectHistoryService.create(
        {
          status: StatusProjectHistoryEnum.Planning,
        },
        project_id,
        user_id,
        i18n,
      );
      this.projectService.updateStatusProject(
        project_id,
        StatusProjectHistoryEnum.Planning,
        user_id,
      );
      return data;
    }
    return data;
  }
  async findById(id: number) {
    const data = await this.projectDetailRepository.findOne({
      select: {
        id: true,
        project_id: true,
        fabric_percentage_of_loss: true,
        finished_goods_percentage_of_loss: true,
        is_confirm: true,
        is_sampling: true,
        material_source: true,
        packaging_accessories_percentage_of_loss: true,
        packaging_instructions: true,
        sewing_accessories_percentage_of_loss: true,
        status: true,
        total_price: true,
        type: true,
      },
      where: { id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    return data;
  }

  async updateIsSampling(id, is_sampling) {
    return await this.projectDetailRepository.update(
      { id },
      {
        is_sampling,
      },
    );
  }
  async updateIsConfirm(
    project_id: number,
    id: number,
    projectPlanningConfirmDto: ProjectPlanningConfirmDto,
    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.update(
      {
        project_id,
        id,
      },
      {
        is_confirm: projectPlanningConfirmDto.is_confirmation,
        status: projectPlanningConfirmDto.status,
      },
    );
    this.projectHistoryService.create(
      {
        status: StatusProjectHistoryEnum.Sampling,
      },
      project_id,
      user_id,
      i18n,
    );
    this.projectService.updateStatusProject(
      project_id,
      StatusProjectHistoryEnum.Sampling,
      user_id,
    );
    return data;
  }
  async createProjectDetailSampling(
    project_id,
    createProjectDetailDto: CreateProjectDetailDto,

    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Sampling',
      },
    });
    if (!data) {
      const data = this.projectDetailRepository.create({
        ...createProjectDetailDto,
        created_at: new Date().toISOString(),
        created_by: user_id,
        project_id,
      });
      await this.projectDetailRepository.save(data);
      this.projectHistoryService.create(
        {
          status: StatusProjectHistoryEnum.Sampling,
        },
        project_id,
        user_id,
        i18n,
      );
      this.projectService.updateStatusProject(
        project_id,
        StatusProjectHistoryEnum.Sampling,
        user_id,
      );
      return data;
    }
    return data;
  }

  async findProjectDetailPlanning(project_id) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Planning',
      },
    });
    return data;
  }

  async findProjectDetailSampling(project_id) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Sampling',
      },
    });
    return data;
  }
  async generateSamplingProject(project_id, user_id, i18n) {
    try {
      const oldProjectDetail = await this.findProjectDetailPlanning(project_id);

      const oldMaterialItem =
        await this.projectPlanningMaterialService.listMaterialItem(
          oldProjectDetail.id,
          { type: null },
          user_id,
        );

      const oldVariant = await this.projectPlanningVariantService.findVariant(
        oldProjectDetail.id,
      );
      const newProjectDetail = await this.createProjectDetailSampling(
        project_id,
        {
          status: StatusProjectDetailEnum.Draft,
          type: TypepProjectDetailEnum.Sampling,
          fabric_percentage_of_loss: oldProjectDetail.fabric_percentage_of_loss,
          finished_goods_percentage_of_loss:
            oldProjectDetail.finished_goods_percentage_of_loss,
          packaging_accessories_percentage_of_loss:
            oldProjectDetail.packaging_accessories_percentage_of_loss,
          sewing_accessories_percentage_of_loss:
            oldProjectDetail.sewing_accessories_percentage_of_loss,
          packaging_instructions: oldProjectDetail.packaging_instructions,
          material_source: oldProjectDetail.material_source,
        },
        user_id,
        i18n,
      );
      const newMaterialItem = [];
      if (Array.isArray(oldMaterialItem) && oldMaterialItem.length > 0) {
        for (const materialItem of oldMaterialItem) {
          const data =
            await this.projectPlanningMaterialService.createMaterialItemOne(
              newProjectDetail.id,
              { ...materialItem, type: materialItem.type },
              user_id,
            );
          newMaterialItem.push(data);
        }
      }
      const newVariant = [];
      if (Array.isArray(oldVariant) && oldVariant.length > 0) {
        for (const variant of oldVariant) {
          const data = await this.projectPlanningVariantService.creteOneVariant(
            newProjectDetail.id,
            { ...variant },
            user_id,
          );
          newVariant.push(data);
        }
      }
      return { ...newProjectDetail, newMaterialItem, newVariant };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findProjectDetailProduction(project_id) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Production',
      },
    });
    return data;
  }
  async createProjectDetailProduction(
    project_id,
    createProjectDetailDto: CreateProjectDetailDto,
    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        type: 'Production',
      },
    });
    if (!data) {
      const data = this.projectDetailRepository.create({
        ...createProjectDetailDto,
        created_at: new Date().toISOString(),
        created_by: user_id,
        project_id,
      });
      await this.projectDetailRepository.save(data);
      this.projectHistoryService.create(
        {
          status: StatusProjectHistoryEnum.Production,
        },
        project_id,
        user_id,
        i18n,
      );
      this.projectService.updateStatusProject(
        project_id,
        StatusProjectHistoryEnum.Production,
        user_id,
      );
      return data;
    }
    return data;
  }
  async generateProductionProject(project_id, user_id, i18n) {
    try {
      const oldProjectDetail = await this.findProjectDetailPlanning(project_id);

      const oldMaterialItem =
        await this.projectPlanningMaterialService.listMaterialItem(
          oldProjectDetail.id,
          { type: null },
          user_id,
        );

      const oldVariant = await this.projectPlanningVariantService.findVariant(
        oldProjectDetail.id,
      );
      const oldProduction =
        await this.projectPlanningVendorProductionService.findVendorProduction(
          oldProjectDetail.id,
        );

      const newProjectDetail = await this.createProjectDetailProduction(
        project_id,
        {
          status: StatusProjectDetailEnum.Draft,
          type: TypepProjectDetailEnum.Production,
          fabric_percentage_of_loss: oldProjectDetail.fabric_percentage_of_loss,
          finished_goods_percentage_of_loss:
            oldProjectDetail.finished_goods_percentage_of_loss,
          packaging_accessories_percentage_of_loss:
            oldProjectDetail.packaging_accessories_percentage_of_loss,
          sewing_accessories_percentage_of_loss:
            oldProjectDetail.sewing_accessories_percentage_of_loss,
          packaging_instructions: oldProjectDetail.packaging_instructions,
          material_source: oldProjectDetail.material_source,
        },
        user_id,
        i18n,
      );
      const newMaterialItem = [];
      if (Array.isArray(oldMaterialItem) && oldMaterialItem.length > 0) {
        for (const materialItem of oldMaterialItem) {
          const data =
            await this.projectPlanningMaterialService.createMaterialItemOne(
              newProjectDetail.id,
              { ...materialItem, type: materialItem.type },
              user_id,
            );
          newMaterialItem.push(data);
        }
      }
      const newVariant = [];
      if (Array.isArray(oldVariant) && oldVariant.length > 0) {
        for (const variant of oldVariant) {
          const data = await this.projectPlanningVariantService.creteOneVariant(
            newProjectDetail.id,
            { ...variant },
            user_id,
          );
          newVariant.push(data);
        }
      }
      let newVendorProduction;
      if (Array.isArray(oldProduction) && oldProduction.length > 0) {
        newVendorProduction = await this.generateVendorProduction(
          newProjectDetail.id,
          oldProduction,
          user_id,
        );
      }
      return {
        ...newProjectDetail,
        newMaterialItem,
        newVariant,
        newVendorProduction,
      };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateSamplingToProduction(
    project_id: number,
    id: number,
    projectConfirmDto: ProjectSamplingConfirmDto,
    user_id,
    i18n,
  ) {
    const data = await this.projectDetailRepository.update(
      {
        project_id,
        id,
      },
      {
        is_confirm: projectConfirmDto.is_confirmation,
        status: projectConfirmDto.status,
      },
    );
    this.projectHistoryService.create(
      {
        status: StatusProjectHistoryEnum.Production,
      },
      project_id,
      user_id,
      i18n,
    );
    this.projectService.updateStatusProject(
      project_id,
      StatusProjectHistoryEnum.Production,
      user_id,
    );
    return data;
  }

  async generateVendorProduction(
    project_detail_id: number,
    vendorProduction: ProjectVendorProductionEntity[],
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const arrResult = [];
      for (const vendor of vendorProduction) {
        const insert = await queryRunner.manager.insert(
          ProjectVendorProductionEntity,
          {
            activity_id: vendor.activity_id,
            activity_name: vendor.activity_name,
            created_at: new Date().toISOString(),
            created_by: user_id,
            percentage_of_loss: vendor.percentage_of_loss,
            quantity_unit_required: vendor.quantity_unit_required,
            total_quantity: vendor.total_quantity,
            project_detail_id,
          },
        );
        if (
          Array.isArray(vendor.vendor_production_detail) &&
          vendor.vendor_production_detail.length > 0
        ) {
          for (const detail of vendor.vendor_production_detail) {
            await queryRunner.manager.insert(
              ProjectVendorProductionDetailEntity,
              {
                vendor_id: detail.vendor_id,
                vendor_name: detail.vendor_name,
                price: detail.price,
                quantity: detail.quantity,
                quantity_unit: detail.quantity_unit,
              },
            );
          }
        }
        arrResult.push({ id: insert.raw[0].id, ...vendor });
      }
      await queryRunner.commitTransaction();
      return arrResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
