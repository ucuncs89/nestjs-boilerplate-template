import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectPlanningEntity } from 'src/entities/project/project_planning.entity';
import { CreateProjectPlanningDto } from '../dto/create-project-planning.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import {
  CreatePlanningFabricDto,
  UpdatePlanningFabricDto,
} from '../dto/planning-fabric.dto';
import { ProjectPlanningFabricEntity } from 'src/entities/project/project_planning_fabric.entity';
import {
  CreatePlanningSewingDto,
  UpdatePlanningSewingDto,
} from '../dto/planning-sewing.dto';
import { ProjectPlanningAccessoriesSewingEntity } from 'src/entities/project/project_planning_accessories_sewing.entity';
import { ProjectPlanningAccessoriesPackagingEntity } from 'src/entities/project/project_planning_accessories_packaging.entity';
import {
  CreatePlanningPackagingDto,
  UpdatePlanningPackagingDto,
} from '../dto/planning-packaging.dto';
import { UpdateProjectPlanningDto } from '../dto/update-project-planning.dto';
import {
  CreatePlanningVariantDto,
  UpdatePlanningVariantDtoDto,
} from '../dto/planning-variant.dto';

@Injectable()
export class ProjectPlanningService {
  constructor(
    @InjectRepository(ProjectPlanningEntity)
    private projectPlanningRepository: Repository<ProjectPlanningEntity>,

    @InjectRepository(ProjectPlanningFabricEntity)
    private projectPlanningFabricRepository: Repository<ProjectPlanningFabricEntity>,

    @InjectRepository(ProjectPlanningAccessoriesSewingEntity)
    private projectPlanningAccessoriesSewingRepository: Repository<ProjectPlanningAccessoriesSewingEntity>,

    @InjectRepository(ProjectPlanningAccessoriesPackagingEntity)
    private projectPlanningAccessoriesPackagingRepository: Repository<ProjectPlanningAccessoriesPackagingEntity>,

    private connection: Connection,
  ) {}
  async generatePlanningId(project_id: number, user_id: number) {
    const projectPlanning = await this.projectPlanningRepository.findOne({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!projectPlanning) {
      const data = this.projectPlanningRepository.create({
        project_id,
        status: 'Draft',
        created_at: new Date().toISOString(),
        created_by: user_id,
        material_source: '',
      });
      await this.projectPlanningRepository.save(data);
      return { planning_id: data.id, status: data.status, material_source: '' };
    }
    return {
      planning_id: projectPlanning.id,
      status: projectPlanning.status,
      material_source: projectPlanning.material_source,
    };
  }
  async create(
    createProjectPlanningDto: CreateProjectPlanningDto,
    project_id: number,
    user_id,
    i18n,
  ) {
    try {
      const planning = this.projectPlanningRepository.create({
        ...createProjectPlanningDto,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectPlanningRepository.save(planning);
      return planning;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updatePlanning(
    updateProjectPlanningDto: UpdateProjectPlanningDto,
    planning_id: number,
    project_id: number,
    user_id: number,
  ) {
    return await this.projectPlanningRepository.update(
      { id: planning_id, project_id },
      {
        ...updateProjectPlanningDto,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      },
    );
  }
  async createPlanningFabric(
    createPlanningFabricDto: CreatePlanningFabricDto,
    project_id,
    planning_id,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const fabric of createPlanningFabricDto.fabric) {
        fabric.project_planning_id = planning_id;
        fabric.created_at = new Date().toISOString();
        fabric.created_by = user_id;
      }
      await queryRunner.manager.insert(
        ProjectPlanningFabricEntity,
        createPlanningFabricDto.fabric,
      );

      await queryRunner.commitTransaction();
      return createPlanningFabricDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async detailPlanning(project_id: number, planning_id: number) {
    const projectPlanning = await this.projectPlanningRepository.findOne({
      where: {
        project_id,
        id: planning_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return projectPlanning;
  }
  async updatePlanningFabric(
    updatePlanningFabricDto: UpdatePlanningFabricDto,
    project_id,
    planning_id,
    planning_fabric_id,
    user_id,
  ) {
    const planning = await this.projectPlanningFabricRepository.save({
      id: planning_fabric_id,
      updated_at: new Date().toISOString(),
      updated_by: user_id,
      ...updatePlanningFabricDto,
    });
    return planning;
  }
  async findPlanningFabric(project_planning_id: number) {
    const data = await this.projectPlanningFabricRepository.find({
      select: {
        id: true,
        project_planning_id: true,
        fabric_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_planning_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async findDetailPlanningFabric(planning_id, planning_fabric_id) {
    const data = await this.projectPlanningFabricRepository.findOne({
      where: {
        project_planning_id: planning_id,
        id: planning_fabric_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        fabric_id: true,
        name: true,
        category: true,
        used_for: true,
        cut_shape: true,
        consumption: true,
        consumption_unit: true,
        heavy: true,
        heavy_unit: true,
        long: true,
        long_unit: true,
        wide: true,
        wide_unit: true,
        diameter: true,
        diameter_unit: true,
      },
    });
    return data;
  }
  async removePlanningFabric(planning_id, planning_fabric_id, user_id) {
    const fabric = await this.projectPlanningFabricRepository.findOne({
      where: {
        project_planning_id: planning_id,
        id: planning_fabric_id,
      },
    });
    if (!fabric) {
      throw new AppErrorNotFoundException();
    }
    fabric.deleted_at = new Date().toISOString();
    fabric.deleted_by = user_id;
    await this.projectPlanningFabricRepository.save(fabric);
    return true;
  }

  async createPlanningSewing(
    createPlanningSewingDto: CreatePlanningSewingDto,
    planning_id,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const sewing of createPlanningSewingDto.accessories_sewing) {
        sewing.project_planning_id = planning_id;
        sewing.created_at = new Date().toISOString();
        sewing.created_by = user_id;
      }
      await queryRunner.manager.insert(
        ProjectPlanningAccessoriesSewingEntity,
        createPlanningSewingDto.accessories_sewing,
      );

      await queryRunner.commitTransaction();
      return createPlanningSewingDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async updatePlanningSewing(
    updatePlanningSewingDto: UpdatePlanningSewingDto,
    planning_accessories_sewing_id,
    user_id,
  ) {
    const planning = await this.projectPlanningAccessoriesSewingRepository.save(
      {
        id: planning_accessories_sewing_id,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
        ...updatePlanningSewingDto,
      },
    );
    return planning;
  }
  async findPlanningSewing(project_planning_id: number) {
    const data = await this.projectPlanningAccessoriesSewingRepository.find({
      select: {
        id: true,
        project_planning_id: true,
        accessories_sewing_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_planning_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async findDetailPlanningSewing(planning_id, planning_accessories_sewing_id) {
    const data = await this.projectPlanningAccessoriesSewingRepository.findOne({
      where: {
        project_planning_id: planning_id,
        id: planning_accessories_sewing_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        accessories_sewing_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
    });
    return data;
  }
  async removePlanningSewing(
    planning_id,
    planning_accessories_sewing_id,
    user_id,
  ) {
    const sewing =
      await this.projectPlanningAccessoriesSewingRepository.findOne({
        where: {
          project_planning_id: planning_id,
          id: planning_accessories_sewing_id,
        },
      });
    if (!sewing) {
      throw new AppErrorNotFoundException();
    }
    sewing.deleted_at = new Date().toISOString();
    sewing.deleted_by = user_id;
    await this.projectPlanningAccessoriesSewingRepository.save(sewing);
    return true;
  }

  //packaging
  async createPlanningPackaging(
    createPlanningPackagingDto: CreatePlanningPackagingDto,
    planning_id,
    user_id,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const packaging of createPlanningPackagingDto.accessories_packaging) {
        packaging.project_planning_id = planning_id;
        packaging.created_at = new Date().toISOString();
        packaging.created_by = user_id;
      }
      await queryRunner.manager.insert(
        ProjectPlanningAccessoriesPackagingEntity,
        createPlanningPackagingDto.accessories_packaging,
      );

      await queryRunner.commitTransaction();
      return createPlanningPackagingDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async updatePlanningPackaging(
    updatePlanningPackagingDto: UpdatePlanningPackagingDto,
    planning_accessories_packaging_id,
    user_id,
  ) {
    const planning =
      await this.projectPlanningAccessoriesPackagingRepository.save({
        id: planning_accessories_packaging_id,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
        ...updatePlanningPackagingDto,
      });
    return planning;
  }
  async findPlanningPackaging(project_planning_id: number) {
    const data = await this.projectPlanningAccessoriesPackagingRepository.find({
      select: {
        id: true,
        project_planning_id: true,
        accessories_packaging_id: true,
        name: true,
        category: true,
        consumption: true,
        consumption_unit: true,
      },
      where: {
        project_planning_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async findDetailPlanningPackaging(
    planning_id,
    planning_accessories_packaging_id,
  ) {
    const data =
      await this.projectPlanningAccessoriesPackagingRepository.findOne({
        where: {
          project_planning_id: planning_id,
          id: planning_accessories_packaging_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        select: {
          id: true,
          accessories_packaging_id: true,
          name: true,
          category: true,
          consumption: true,
          consumption_unit: true,
        },
      });
    return data;
  }
  async removePlanningPackaging(
    planning_id,
    planning_accessories_packaging_id,
    user_id,
  ) {
    const packaging =
      await this.projectPlanningAccessoriesPackagingRepository.findOne({
        where: {
          project_planning_id: planning_id,
          id: planning_accessories_packaging_id,
        },
      });
    if (!packaging) {
      throw new AppErrorNotFoundException();
    }
    packaging.deleted_at = new Date().toISOString();
    packaging.deleted_by = user_id;
    await this.projectPlanningAccessoriesPackagingRepository.save(packaging);
    return true;
  }

  //variant
  async createPlanningVariant(
    createPlanningVariantDto: CreatePlanningVariantDto,
    planning_id,
    user_id,
  ) {
    // const queryRunner = this.connection.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   for (const packaging of createPlanningPackagingDto.accessories_packaging) {
    //     packaging.project_planning_id = planning_id;
    //     packaging.created_at = new Date().toISOString();
    //     packaging.created_by = user_id;
    //   }
    //   await queryRunner.manager.insert(
    //     ProjectPlanningAccessoriesPackagingEntity,
    //     createPlanningPackagingDto.accessories_packaging,
    //   );

    //   await queryRunner.commitTransaction();
    //   return createPlanningPackagingDto;
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   throw new AppErrorException(error.message);
    // } finally {
    //   await queryRunner.release();
    // }
    return { data: 'belum beres' };
  }
  async updatePlanningVariant(
    updatePlanningVariantDtoDto: UpdatePlanningVariantDtoDto,
    planning_variant_id,
    user_id,
  ) {
    // const planning =
    //   await this.projectPlanningAccessoriesPackagingRepository.save({
    //     id: planning_accessories_packaging_id,
    //     updated_at: new Date().toISOString(),
    //     updated_by: user_id,
    //     ...updatePlanningPackagingDto,
    //   });
    return { data: 'belum beres' };
  }
  async findPlanningVariant(project_planning_id: number) {
    // const data = await this.projectPlanningAccessoriesPackagingRepository.find({
    //   select: {
    //     id: true,
    //     project_planning_id: true,
    //     accessories_packaging_id: true,
    //     name: true,
    //     category: true,
    //     consumption: true,
    //     consumption_unit: true,
    //   },
    //   where: {
    //     project_planning_id,
    //     deleted_at: IsNull(),
    //     deleted_by: IsNull(),
    //   },
    // });
    return { data: 'belum beres' };
  }
  async findDetailPlanningVariant(planning_id, planning_variant_id) {
    // const data =
    //   await this.projectPlanningAccessoriesPackagingRepository.findOne({
    //     where: {
    //       project_planning_id: planning_id,
    //       id: planning_accessories_packaging_id,
    //       deleted_at: IsNull(),
    //       deleted_by: IsNull(),
    //     },
    //     select: {
    //       id: true,
    //       accessories_packaging_id: true,
    //       name: true,
    //       category: true,
    //       consumption: true,
    //       consumption_unit: true,
    //     },
    //   });
    return { data: 'belum beres' };
  }
  async removePlanningVariant(planning_id, planning_variant_id, user_id) {
    // const packaging =
    //   await this.projectPlanningAccessoriesPackagingRepository.findOne({
    //     where: {
    //       project_planning_id: planning_id,
    //       id: planning_accessories_packaging_id,
    //     },
    //   });
    // if (!packaging) {
    //   throw new AppErrorNotFoundException();
    // }
    // packaging.deleted_at = new Date().toISOString();
    // packaging.deleted_by = user_id;
    // await this.projectPlanningAccessoriesPackagingRepository.save(packaging);
    return { data: 'belum beres' };
  }
}
