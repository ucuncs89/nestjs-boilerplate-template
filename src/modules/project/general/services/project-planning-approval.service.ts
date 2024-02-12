import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPlanningApprovalEntity } from 'src/entities/project/project_planning_approval.entity';
import { IsNull, Repository } from 'typeorm';
import {
  ProjectApprovalPlanningStatusDto,
  ProjectPlanningApprovalDto,
} from '../dto/project-planning-approval.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { TypeProjectDetailCalculateEnum } from '../dto/project-detail.dto';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { StatusProjectEnum } from '../dto/get-list-project.dto';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';

@Injectable()
export class ProjectPlanningApprovalService {
  constructor(
    @InjectRepository(ProjectPlanningApprovalEntity)
    private projectPlanningApprovalRepository: Repository<ProjectPlanningApprovalEntity>,
  ) {}

  async createPlanningApproval(
    projectPlanningApprovalDto: ProjectPlanningApprovalDto,
    user_id: number,
  ) {
    const approval = await this.projectPlanningApprovalRepository.findOne({
      where: {
        relation_id: projectPlanningApprovalDto.relation_id,
        type: projectPlanningApprovalDto.type,
        project_id: projectPlanningApprovalDto.project_id,
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
  async findOneApproval(
    relation_id: number,
    type: TypeProjectDetailCalculateEnum,
  ) {
    const findOne = await this.projectPlanningApprovalRepository.findOne({
      where: {
        relation_id,
        type,
      },
      select: {
        id: true,
        relation_id: true,
        status: true,
        status_desc: true,
        type: true,
      },
    });
    return findOne;
  }
  async findAll(project_id: number) {
    const data = await this.projectPlanningApprovalRepository.find({
      where: {
        project_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        name: true,
        type: true,
        relation_id: true,
        status: true,
        status_desc: true,
        project_id: true,
      },
    });
    return data;
  }
  async findOne(detail_id: number, project_id: number) {
    const data = await this.projectPlanningApprovalRepository.findOne({
      where: { id: detail_id },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }

    return data;
  }
  async findAllMaterial(project_id: number) {
    const data = await this.projectPlanningApprovalRepository.find({
      where: {
        project_id,
        type: TypeProjectDetailCalculateEnum.Material,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_id: true,
        relation_id: true,
        type: true,
        status: true,
        status_desc: true,
        name: true,
      },
    });
    return data;
  }
  async updateApproval(
    id: number,
    projectApprovalPlanningStatusDto: ProjectApprovalPlanningStatusDto,
  ) {
    const data = await this.projectPlanningApprovalRepository.update(
      { id },
      { status: projectApprovalPlanningStatusDto.status },
    );
    return data;
  }
}
