import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Repository } from 'typeorm';
import { ProjectCostingMaterialService } from '../../costing/services/project-costing-material.service';

@Injectable()
export class ProjectPlanningService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private projectMaterialService: ProjectCostingMaterialService,
  ) {}
  async generatePlanning(project_id: number) {
    const material =
      await this.projectMaterialService.findVendorMaterialCosting(project_id);
    return material;
  }
}
