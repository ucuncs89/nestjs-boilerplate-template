import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionStageEntity } from 'src/entities/project/project_vendor_production_stage.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectProductionStageDto } from '../dto/project-production-stage.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class ProjectProductionStageService {
  constructor(
    @InjectRepository(ProjectVendorProductionStageEntity)
    private projectRepository: Repository<ProjectVendorProductionStageEntity>,
    private connection: Connection,
  ) {}
  async createStage(
    project_id: number,
    projectProductionStageDto: ProjectProductionStageDto,
    user_id: number,
  ) {
    const stage = this.projectRepository.create({
      ...projectProductionStageDto,
      project_id,
      created_by: user_id,
    });
    await this.projectRepository.save(stage);
    return stage;
  }
  async findStage(project_id: number) {
    const data = await this.projectRepository.find({
      where: { project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      order: { id: 'ASC' },
    });
    return data;
  }
  async updateStage(
    project_id: number,
    stage_id: number,
    projectProductionStageDto: ProjectProductionStageDto,
    user_id: number,
  ) {
    const stage = await this.projectRepository.findOne({
      where: { id: stage_id },
    });
    if (!stage) {
      throw new AppErrorNotFoundException();
    }
    try {
      await this.projectRepository.update(
        { project_id, id: stage_id },
        { ...projectProductionStageDto },
      );
      return { ...projectProductionStageDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteStage(project_id: number, stage_id: number) {
    const stage = await this.projectRepository.findOne({
      where: { id: stage_id },
    });
    if (!stage) {
      throw new AppErrorNotFoundException();
    }
    try {
      await this.projectRepository.delete({ id: stage_id, project_id });
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
