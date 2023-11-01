import { Injectable } from '@nestjs/common';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, Repository } from 'typeorm';
import { ProjectPriceDto } from '../dto/project-price.dto';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectPriceAdditionalEntity } from 'src/entities/project/project_price_additional.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectPriceService {
  constructor(
    @InjectRepository(ProjectPriceEntity)
    private projectPriceRepository: Repository<ProjectPriceEntity>,
    private connection: Connection,
  ) {}

  async createProjectPrice(
    project_detail_id,
    projectPriceDto: ProjectPriceDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vendorProduction = await queryRunner.manager.insert(
        ProjectPriceEntity,
        {
          project_detail_id,
          loss_percentage: projectPriceDto.loss_percentage,
          selling_price_per_item: projectPriceDto.selling_price_per_item,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      if (
        Array.isArray(projectPriceDto.additional_price) &&
        projectPriceDto.additional_price.length > 0
      ) {
        for (const addtional of projectPriceDto.additional_price) {
          addtional.project_price_id = vendorProduction.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectPriceAdditionalEntity,
          projectPriceDto.additional_price,
        );
      }

      await queryRunner.commitTransaction();
      return { id: vendorProduction.raw[0].id, ...projectPriceDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findProjectPrice(project_detail_id: number) {
    const data = await this.projectPriceRepository.findOne({
      where: { project_detail_id },
      select: {
        id: true,
        project_detail_id: true,
        selling_price_per_item: true,
        loss_percentage: true,
        additional_price: {
          id: true,
          project_price_id: true,
          additional_name: true,
          additional_price: true,
          description: true,
        },
      },
      relations: {
        additional_price: true,
      },
    });
    return data;
  }

  async updateProjectPrice(
    id,
    projectPriceDto: ProjectPriceDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(ProjectPriceEntity, id, {
        selling_price_per_item: projectPriceDto.selling_price_per_item,
        loss_percentage: projectPriceDto.loss_percentage,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      });
      if (
        Array.isArray(projectPriceDto.additional_price) &&
        projectPriceDto.additional_price.length > 0
      ) {
        for (const addtional of projectPriceDto.additional_price) {
          addtional.project_price_id = id;
        }
        await queryRunner.manager.delete(ProjectPriceAdditionalEntity, {
          project_price_id: id,
        });
        await queryRunner.manager.insert(
          ProjectPriceAdditionalEntity,
          projectPriceDto.additional_price,
        );
      }
      await queryRunner.commitTransaction();
      return projectPriceDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
