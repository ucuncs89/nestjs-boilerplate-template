import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionStageEntity } from 'src/entities/project/project_vendor_production_stage.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectReturStageDto } from '../dto/project-retur-stage.dto';

@Injectable()
export class ProjectReturStageService {
  constructor(
    @InjectRepository(ProjectVendorProductionStageEntity)
    private projectVendorProductionStageRepository: Repository<ProjectVendorProductionStageEntity>,
    private connection: Connection,
  ) {}
  async createStage(
    project_id: number,
    projectReturStageDto: ProjectReturStageDto,
    user_id: number,
    retur_id: number,
  ) {
    const stage = this.projectVendorProductionStageRepository.create({
      ...projectReturStageDto,
      project_id,
      created_by: user_id,
      retur_id,
    });
    await this.projectVendorProductionStageRepository.save(stage);
    return stage;
  }
  async findStage(project_id: number, retur_id: number) {
    const data = await this.projectVendorProductionStageRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        retur_id,
      },
      order: { id: 'ASC' },
    });
    return data;
  }

  async findDetailStage(
    project_id: number,
    stage_id: number,
    retur_id: number,
  ) {
    const data = await this.projectVendorProductionStageRepository.findOne({
      where: {
        id: stage_id,
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        retur_id,
      },
      order: { id: 'ASC' },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async updateStage(
    project_id: number,
    stage_id: number,
    projectReturStageDto: ProjectReturStageDto,
    user_id: number,
    retur_id: number,
  ) {
    const stage = await this.projectVendorProductionStageRepository.findOne({
      where: { id: stage_id, retur_id },
    });
    if (!stage) {
      throw new AppErrorNotFoundException();
    }
    try {
      await this.projectVendorProductionStageRepository.update(
        { project_id, id: stage_id },
        { ...projectReturStageDto },
      );
      return { ...projectReturStageDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteStage(project_id: number, stage_id: number, retur_id: number) {
    const stage = await this.projectVendorProductionStageRepository.findOne({
      where: { id: stage_id, retur_id },
    });
    if (!stage) {
      throw new AppErrorNotFoundException();
    }
    try {
      await this.projectVendorProductionStageRepository.delete({
        id: stage_id,
        project_id,
        retur_id,
      });
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
