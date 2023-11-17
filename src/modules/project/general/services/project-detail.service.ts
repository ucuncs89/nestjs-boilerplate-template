import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import {
  CreateProjectDetailDto,
  StatusProjectDetailEnum,
} from '../dto/create-project-detail.dto';
import { ProjectConfirmDto } from '../../planning/dto/project-confirm.dto';
import { ProjectHistoryService } from './project-history.service';
import { StatusProjectHistoryEnum } from '../dto/create-project-history.dto';
import { ProjectService } from './project.service';
import { ProjectMaterialService } from '../../planning/services/project-material.service';
import { ProjectVariantService } from '../../planning/services/project-variant.service';

@Injectable()
export class ProjectDetailService {
  constructor(
    @InjectRepository(ProjectDetailEntity)
    private projectDetailRepository: Repository<ProjectDetailEntity>,
    private projectHistoryService: ProjectHistoryService,
    private projectService: ProjectService,

    private projectMaterialService: ProjectMaterialService,
    private projectVariantService: ProjectVariantService,

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
    projectConfirmDto: ProjectConfirmDto,
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
  async generateSamplingProject(
    project_id,
    newProjectDetail_id,
    user_id,
    i18n,
  ) {
    const oldProjectDetail = await this.findProjectDetailPlanning(project_id);
    const oldMaterial = await this.projectMaterialService.findByProjectDetail(
      project_id,
      oldProjectDetail.id,
    );
    const oldVariant = await this.projectVariantService.findByProjectDetail(
      project_id,
      oldProjectDetail.id,
    );
    const arrFabric = [];
    if (Array.isArray(oldMaterial.fabric) && oldMaterial.fabric.length) {
      oldMaterial.fabric.map((v) => {
        arrFabric.push({ ...v, method_type: 'New' });
      });
    }
    const arrSewing = [];
    if (
      Array.isArray(oldMaterial.accessories_sewing) &&
      oldMaterial.accessories_sewing.length
    ) {
      oldMaterial.accessories_sewing.map((v) => {
        arrSewing.push({ ...v, method_type: 'New' });
      });
    }
    const arrPackaging = [];
    if (
      Array.isArray(oldMaterial.accessories_packaging) &&
      oldMaterial.accessories_packaging.length
    ) {
      oldMaterial.accessories_packaging.map((v) => {
        arrPackaging.push({ ...v, method_type: 'New' });
      });
    }

    const newMaterial = await this.projectMaterialService.createDetailMaterial(
      project_id,
      newProjectDetail_id,
      {
        material_source: oldMaterial.material_source,
        status: StatusProjectDetailEnum.Draft,
        fabric_percentage_of_loss: oldMaterial.fabric_percentage_of_loss,
        finished_goods_percentage_of_loss:
          oldMaterial.finished_goods_percentage_of_loss,
        packaging_accessories_percentage_of_loss:
          oldMaterial.packaging_accessories_percentage_of_loss,
        sewing_accessories_percentage_of_loss:
          oldMaterial.sewing_accessories_percentage_of_loss,
        packaging_instructions: oldMaterial.packaging_instructions,
        fabric: arrFabric,
        accessories_sewing: arrSewing,
        accessories_packaging: arrPackaging,
      },
      user_id,
      i18n,
    );

    const newVariant = await this.projectVariantService.createProjectVariant(
      project_id,
      newProjectDetail_id,
      { variant: oldVariant },
      user_id,
      i18n,
    );
    return { newMaterial, newVariant };
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

  async generateProductionProject(
    project_id,
    newProjectDetail_id,
    user_id,
    i18n,
  ) {
    const oldProjectDetail = await this.findProjectDetailPlanning(project_id);
    const oldMaterial = await this.projectMaterialService.findByProjectDetail(
      project_id,
      oldProjectDetail.id,
    );
    const oldVariant = await this.projectVariantService.findByProjectDetail(
      project_id,
      oldProjectDetail.id,
    );
    const arrFabric = [];
    if (Array.isArray(oldMaterial.fabric) && oldMaterial.fabric.length) {
      oldMaterial.fabric.map((v) => {
        arrFabric.push({ ...v, method_type: 'New' });
      });
    }
    const arrSewing = [];
    if (
      Array.isArray(oldMaterial.accessories_sewing) &&
      oldMaterial.accessories_sewing.length
    ) {
      oldMaterial.accessories_sewing.map((v) => {
        arrSewing.push({ ...v, method_type: 'New' });
      });
    }
    const arrPackaging = [];
    if (
      Array.isArray(oldMaterial.accessories_packaging) &&
      oldMaterial.accessories_packaging.length
    ) {
      oldMaterial.accessories_packaging.map((v) => {
        arrPackaging.push({ ...v, method_type: 'New' });
      });
    }

    const newMaterial = await this.projectMaterialService.createDetailMaterial(
      project_id,
      newProjectDetail_id,
      {
        material_source: oldMaterial.material_source,
        status: StatusProjectDetailEnum.Draft,
        fabric_percentage_of_loss: oldMaterial.fabric_percentage_of_loss,
        finished_goods_percentage_of_loss:
          oldMaterial.finished_goods_percentage_of_loss,
        packaging_accessories_percentage_of_loss:
          oldMaterial.packaging_accessories_percentage_of_loss,
        sewing_accessories_percentage_of_loss:
          oldMaterial.sewing_accessories_percentage_of_loss,
        packaging_instructions: oldMaterial.packaging_instructions,
        fabric: arrFabric,
        accessories_sewing: arrSewing,
        accessories_packaging: arrPackaging,
      },
      user_id,
      i18n,
    );

    const newVariant = await this.projectVariantService.createProjectVariant(
      project_id,
      newProjectDetail_id,
      { variant: oldVariant },
      user_id,
      i18n,
    );
    return { newMaterial, newVariant };
  }

  async updateSamplingToProduction(
    project_id: number,
    id: number,
    projectConfirmDto: ProjectConfirmDto,
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
}
