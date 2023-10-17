import { Injectable } from '@nestjs/common';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateProjectMaterialDto } from '../dto/create-project-material.dto';
import { ProjectMaterialEntity } from 'src/entities/project/project_material.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectFabricEntity } from 'src/entities/project/project_fabric.entity';
import { ProjectAccessoriesSewingEntity } from 'src/entities/project/project_accessories_sewing.entity';
import { ProjectAccessoriesPackagingEntity } from 'src/entities/project/project_accessories_packaging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProjectMaterialDto } from '../dto/update-project-material.dto';
import { ProjectVariantService } from './project_variant.service';

@Injectable()
export class ProjectMaterialService {
  constructor(
    @InjectRepository(ProjectMaterialEntity)
    private projectMaterialRepository: Repository<ProjectMaterialEntity>,

    @InjectRepository(ProjectFabricEntity)
    private projectFabricRepository: Repository<ProjectFabricEntity>,

    @InjectRepository(ProjectAccessoriesSewingEntity)
    private projectAccessoriesSewingRepository: Repository<ProjectAccessoriesSewingEntity>,

    @InjectRepository(ProjectAccessoriesPackagingEntity)
    private projectAccessoriesPackagingRepository: Repository<ProjectAccessoriesPackagingEntity>,

    private projectVariantService: ProjectVariantService,
    private connection: Connection,
  ) {}

  async createDetailMaterial(
    project_id: number,
    project_detail_id: number,
    createProjectMaterialDto: CreateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.insert(
        ProjectMaterialEntity,
        {
          project_detail_id,
          material_source: createProjectMaterialDto.material_source,
          total_price: createProjectMaterialDto.total_price,
          fabric_percentage_of_loss:
            createProjectMaterialDto.fabric_percentage_of_loss,
          sewing_accessories_percentage_of_loss:
            createProjectMaterialDto.sewing_accessories_percentage_of_loss,
          packaging_accessories_percentage_of_loss:
            createProjectMaterialDto.packaging_accessories_percentage_of_loss,
          packaging_instructions:
            createProjectMaterialDto.packaging_instructions,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      if (
        Array.isArray(createProjectMaterialDto.fabric) &&
        createProjectMaterialDto.fabric.length > 0
      ) {
        for (const fabric of createProjectMaterialDto.fabric) {
          fabric.project_material_id = projectMaterial.raw[0].id;
        }

        await queryRunner.manager.insert(
          ProjectFabricEntity,
          createProjectMaterialDto.fabric,
        );
      }
      if (
        Array.isArray(createProjectMaterialDto.accessories_sewing) &&
        createProjectMaterialDto.accessories_sewing.length > 0
      ) {
        for (const sewing of createProjectMaterialDto.accessories_sewing) {
          sewing.project_material_id = projectMaterial.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectAccessoriesSewingEntity,
          createProjectMaterialDto.accessories_sewing,
        );
      }
      if (
        Array.isArray(createProjectMaterialDto.accessories_packaging) &&
        createProjectMaterialDto.accessories_packaging.length > 0
      ) {
        for (const sewing of createProjectMaterialDto.accessories_packaging) {
          sewing.project_material_id = projectMaterial.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectAccessoriesPackagingEntity,
          createProjectMaterialDto.accessories_packaging,
        );
      }
      await queryRunner.commitTransaction();
      return { id: projectMaterial.raw[0].id, ...createProjectMaterialDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findByProjectDetail(project_id: number, project_detail_id: number) {
    return await this.projectMaterialRepository.findOne({
      where: { project_detail_id },
      relations: {
        fabric: true,
        accessories_sewing: true,
        accessories_packaging: true,
      },
    });
  }
  async findDetailbyMaterialId(
    project_id: number,
    project_detail_id: number,
    material_id: number,
  ) {
    return await this.projectMaterialRepository.findOne({
      where: { project_detail_id, id: material_id },
      relations: {
        fabric: true,
        accessories_sewing: true,
        accessories_packaging: true,
      },
    });
  }

  async updateDetailMaterial(
    project_id: number,
    project_detail_id: number,
    project_material_id: number,
    updateProjectMaterialDto: UpdateProjectMaterialDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const projectMaterial = await queryRunner.manager.update(
        ProjectMaterialEntity,
        project_material_id,
        {
          project_detail_id,
          material_source: updateProjectMaterialDto.material_source,
          total_price: updateProjectMaterialDto.total_price,
          fabric_percentage_of_loss:
            updateProjectMaterialDto.fabric_percentage_of_loss,
          sewing_accessories_percentage_of_loss:
            updateProjectMaterialDto.sewing_accessories_percentage_of_loss,
          packaging_accessories_percentage_of_loss:
            updateProjectMaterialDto.packaging_accessories_percentage_of_loss,
          packaging_instructions:
            updateProjectMaterialDto.packaging_instructions,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      // fabric
      if (
        Array.isArray(updateProjectMaterialDto.fabric) &&
        updateProjectMaterialDto.fabric.length > 0
      ) {
        for (const fabric of updateProjectMaterialDto.fabric) {
          fabric.project_material_id = project_material_id;
        }

        await queryRunner.manager.delete(ProjectFabricEntity, {
          project_material_id,
        });

        await queryRunner.manager.insert(
          ProjectFabricEntity,
          updateProjectMaterialDto.fabric,
        );
      }
      //accessories sewing
      if (
        Array.isArray(updateProjectMaterialDto.accessories_sewing) &&
        updateProjectMaterialDto.accessories_sewing.length > 0
      ) {
        for (const sewing of updateProjectMaterialDto.accessories_sewing) {
          sewing.project_material_id = project_material_id;
        }
        await queryRunner.manager.delete(ProjectAccessoriesSewingEntity, {
          project_material_id,
        });
        await queryRunner.manager.insert(
          ProjectAccessoriesSewingEntity,
          updateProjectMaterialDto.accessories_sewing,
        );
      }
      //accessories packaging
      if (
        Array.isArray(updateProjectMaterialDto.accessories_packaging) &&
        updateProjectMaterialDto.accessories_packaging.length > 0
      ) {
        for (const sewing of updateProjectMaterialDto.accessories_packaging) {
          sewing.project_material_id = project_material_id;
        }
        await queryRunner.manager.delete(ProjectAccessoriesPackagingEntity, {
          project_material_id,
        });
        await queryRunner.manager.insert(
          ProjectAccessoriesPackagingEntity,
          updateProjectMaterialDto.accessories_packaging,
        );
      }
      await queryRunner.commitTransaction();
      return { id: project_material_id, ...updateProjectMaterialDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findProjectFabricVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const fabric = await this.projectFabricRepository.find({
      select: {
        id: true,
        project_material_id: true,
        fabric_id: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        consumption: true,
        consumption_unit: true,
        heavy: true,
        heavy_unit: true,
        wide: true,
        wide_unit: true,
        diameter: true,
        diameter_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of fabric) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }
  async findProjectSewingVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const sewing = await this.projectAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_material_id: true,
        accessories_sewing_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of sewing) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }

  async findProjectPackagingVariant(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const arrResult = [];
    const packaging = await this.projectAccessoriesPackagingRepository.find({
      select: {
        id: true,
        project_material_id: true,
        accessories_packaging_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_material_id: findProjectMaterialId.id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    const variant = await this.projectVariantService.findByProjectDetail(
      null,
      project_detail_id,
    );
    for (const data of packaging) {
      arrResult.push({ ...data, variant });
    }
    return arrResult;
  }
  async findProjectConfirmFabric(project_detail_id: number) {
    const findProjectMaterialId = await this.projectMaterialRepository.findOne({
      where: {
        project_detail_id,
      },
      select: {
        id: true,
        project_detail_id: true,
      },
    });
    if (!findProjectMaterialId) {
      throw new AppErrorNotFoundException();
    }
    const data = await this.projectFabricRepository
      .createQueryBuilder('project_fabric')
      .select([
        'project_fabric.id',
        'project_fabric.project_material_id',
        'project_fabric.name',
      ])
      .where('project_fabric.project_material_id = :material_id', {
        material_id: findProjectMaterialId.id,
      })
      .leftJoin(
        'project_vendor_material_fabric',
        'pvmf',
        'project_fabric.id = pvmf.project_fabric_id',
      )
      .getMany();

    return data;
  }
}
