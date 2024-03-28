import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { MaterialSourceTypeProjectEnum } from '../../general/dto/create-project.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectMaterialItemEnum } from '../dto/project-costing-material.dto';
import { ProjectVariantEntity } from 'src/entities/project/project_variant.entity';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';

@Injectable()
export class ProjectCostingService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}

  async generateUpdateCosting(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: project_id,
      },
    });

    if (project.status === 'Project Created') {
      const data = await this.projectRepository.update(
        { id: project_id },
        {
          status: StatusProjectEnum.Costing,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      if (
        project.material_source ===
        MaterialSourceTypeProjectEnum.PurchaseFinishedGoods
      ) {
        const finishedGoods = await this.generateFinishedGood(
          project_id,
          user_id,
        );
        return { generate_project_costing: 'new', data, finishedGoods };
      }
      return { generate_project_costing: 'new', data };
    }
    return { generate_project_costing: 'old' };
  }
  async publishCosting(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (project.status === StatusProjectEnum.Costing) {
      const data = await this.projectRepository.update(
        { id: project_id },
        { can_planning: true },
      );
      return data;
    }
    return { data: 'Already' };
  }
  async cancelPublishCosting(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (project.status === StatusProjectEnum.Costing) {
      const data = await this.projectRepository.update(
        { id: project_id },
        { can_planning: false },
      );
      return data;
    }
    return { data: 'Already' };
  }
  async generateFinishedGood(project_id: number, user_id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let insert: any;
      const dataExist = await queryRunner.manager.findOne(
        ProjectMaterialItemEntity,
        {
          where: {
            type: ProjectMaterialItemEnum.Finishedgoods,
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        },
      );
      if (!dataExist) {
        insert = await queryRunner.manager.insert(ProjectMaterialItemEntity, {
          type: ProjectMaterialItemEnum.Finishedgoods,
          project_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
          relation_id: 0,
          name: ProjectMaterialItemEnum.Finishedgoods,
          added_in_section: StatusProjectEnum.Costing,
        });
        const variant = await queryRunner.manager.find(ProjectVariantEntity, {
          where: {
            project_id,
            deleted_at: IsNull(),
            deleted_by: IsNull(),
          },
        });
        if (variant.length > 0) {
          for (const dataVariant of variant) {
            await queryRunner.manager.insert(ProjectVendorMaterialEntity, {
              project_variant_id: dataVariant.id,
              project_material_item_id: insert.raw[0].id,
              project_id,
              added_in_section: StatusProjectEnum.Costing,
            });
          }
        }
      }
      await queryRunner.commitTransaction();
      return { insert };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
