import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ProjectProductionService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}
  async generateProduction(project_id: number, user_id: number) {}
  async duplicatePlanningToProduction(project_id: number, user_id: number) {}
}
