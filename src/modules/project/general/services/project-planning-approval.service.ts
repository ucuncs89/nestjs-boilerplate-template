import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPlanningApprovalEntity } from 'src/entities/project/project_planning_approval.entity';
import { Repository } from 'typeorm';
import { ProjectPlanningApprovalDto } from '../dto/project-planning-approval.dto';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class ProjectPlanningApprovalService {
  constructor(
    @InjectRepository(ProjectPlanningApprovalEntity)
    private projectPlanningApprovalRepository: Repository<ProjectPlanningApprovalEntity>,
  ) {}
  // async findMaterialApproval(project_id) {}
  async createPlanningApproval(
    projectPlanningApprovalDto: ProjectPlanningApprovalDto,
    user_id: number,
  ) {
    const approval = await this.projectPlanningApprovalRepository.findOne({
      where: {
        relation_id: projectPlanningApprovalDto.relation_id,
        type: projectPlanningApprovalDto.type,
      },
    });
    try {
      if (!approval) {
        const data = this.projectPlanningApprovalRepository.create({
          ...projectPlanningApprovalDto,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
        await this.projectPlanningApprovalRepository.save(data);
        return data;
      } else {
        const data = await this.projectPlanningApprovalRepository.update(
          { id: approval.id },
          {
            relation_id: projectPlanningApprovalDto.relation_id,
            status: projectPlanningApprovalDto.status,
          },
        );
        return data;
      }
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
