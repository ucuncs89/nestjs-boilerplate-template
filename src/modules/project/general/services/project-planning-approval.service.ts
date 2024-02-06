import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectPlanningApprovalService {
  constructor(
    @InjectRepository(ProjectMaterialItemEntity)
    private ProjectMaterialItemRepository: Repository<ProjectMaterialItemEntity>,
  ) {}
  async findMaterialApproval(project_id) {}
}
