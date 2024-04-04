import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectPlanningShippingService } from '../../planning/services/project-planning-shipping.service';
import { ProjectPlanningAdditionalCostService } from '../../planning/services/project-planning-additional-cost.service';

@Injectable()
export class ProjectProductionService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private projectPlanningShippingService: ProjectPlanningShippingService,
    private projectPlanningAdditionalCostService: ProjectPlanningAdditionalCostService,
    private connection: Connection,
  ) {}
  async generateProduction(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (project.status === StatusProjectEnum.Production) {
      return { data: 'already' };
    }
    if (project.status === StatusProjectEnum.Planning) {
      const shipping =
        await this.projectPlanningShippingService.findByProjectDetailId(
          project_id,
        );
      const additionalCost =
        await this.projectPlanningAdditionalCostService.findAll(project_id);

      const duplicate = await this.duplicatePlanningToProduction(
        project_id,
        shipping,
        additionalCost,
      );
      return {
        shipping,
        additionalCost,
        duplicate,
      };
    } else {
      throw new AppErrorException(
        `Sorry, can't continue to the next step because the previous section is not "planning"`,
      );
    }
  }
  async duplicatePlanningToProduction(
    project_id: number,
    arrShipping?: ProjectShippingEntity[],
    arrAdditionalCost?: ProjectAdditionalCostEntity[],
  ) {
    const arrResult: any[] = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (Array.isArray(arrShipping) && arrShipping.length > 0) {
        for (const shipping of arrShipping) {
          shipping.added_in_section = StatusProjectEnum.Production;
          shipping.costing_project_shipping_id = shipping.id;
          const insertShipping = await queryRunner.manager.insert(
            ProjectShippingEntity,
            {
              ...shipping,
              created_at: new Date().toISOString(),
            },
          );
          arrResult.push({ shipping_id: insertShipping.raw[0].id });
        }
      }
      if (Array.isArray(arrAdditionalCost) && arrAdditionalCost.length > 0) {
        for (const additionalCost of arrAdditionalCost) {
          additionalCost.added_in_section = StatusProjectEnum.Production;
          additionalCost.costing_project_additional_cost_id = additionalCost.id;
          const additionalInsert = await queryRunner.manager.insert(
            ProjectAdditionalCostEntity,
            {
              ...additionalCost,
              project_id,
              created_at: new Date().toISOString(),
            },
          );
          arrResult.push({ addtional_id: additionalInsert.raw[0].id });
        }
      }
      const update = await queryRunner.manager.update(
        ProjectEntity,
        { id: project_id },
        { status: StatusProjectEnum.Production },
      );
      await queryRunner.commitTransaction();
      return { new: arrResult, update };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);

      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async publishProduction(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (!project) {
      throw new AppErrorNotFoundException('Data Project Not Found');
    }
    if (project.status === StatusProjectEnum.Production) {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          can_production: true,
          updated_by: user_id,
          status: StatusProjectEnum.Complete,
        },
      );
      return data;
    }
    return { data: 'Already' };
  }
}
