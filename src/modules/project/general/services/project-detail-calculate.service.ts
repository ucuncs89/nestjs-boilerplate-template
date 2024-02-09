import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetailCalculateEntity } from 'src/entities/project/project_detail_calculate.entity';
import { Repository } from 'typeorm';
import { TypeProjectDetailCalculateEnum } from '../dto/project-detail.dto';
import { StatusProjectEnum } from '../dto/get-list-project.dto';

Injectable();
export class ProjectDetailCalculateService {
  constructor(
    @InjectRepository(ProjectDetailCalculateEntity)
    private projectDetailCalculateRepository: Repository<ProjectDetailCalculateEntity>,
  ) {}
  async findOneDetail(
    project_id: number,
    type: TypeProjectDetailCalculateEnum,
    added_in_section: StatusProjectEnum,
  ) {
    const data = await this.projectDetailCalculateRepository.findOne({
      where: { project_id, type, added_in_section },
    });
    return data;
  }
  async compareCostingPlanningIsPassed(
    project_id: number,
    type: TypeProjectDetailCalculateEnum,
  ) {
    const costing = await this.projectDetailCalculateRepository.findOne({
      where: {
        project_id,
        type,
        added_in_section: StatusProjectEnum.Costing,
      },
      select: {
        project_id: true,
        total_price: true,
        type: true,
        avg_price: true,
        added_in_section: true,
      },
    });
    const planning = await this.projectDetailCalculateRepository.findOne({
      where: {
        project_id,
        type,
        added_in_section: StatusProjectEnum.Planning,
      },
      select: {
        project_id: true,
        total_price: true,
        type: true,
        avg_price: true,
        added_in_section: true,
      },
    });

    let isPassed = false;

    if (planning && costing && costing.avg_price > planning.avg_price) {
      isPassed = true;
    }

    return { is_passed: isPassed, costing, planning };
  }
  async upsertCalculate(
    project_id: number,
    type: TypeProjectDetailCalculateEnum,
    added_in_section: StatusProjectEnum,
    avg_price?: number,
    total_price?: number,
  ) {
    try {
      return await this.projectDetailCalculateRepository.upsert(
        {
          project_id,
          type,
          added_in_section,
          avg_price,
          total_price,
        },
        {
          conflictPaths: {
            project_id: true,
            type: true,
            added_in_section: true,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
