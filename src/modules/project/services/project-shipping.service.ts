import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateProjectShippingDto } from '../dto/project-shipping.dto';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';

@Injectable()
export class ProjectShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,
    private connection: Connection,
  ) {}

  async createShipping(
    project_detail_id,
    createProjectShippingDto: CreateProjectShippingDto,
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        Array.isArray(createProjectShippingDto.shipping) &&
        createProjectShippingDto.shipping.length > 0
      ) {
        for (const shipping of createProjectShippingDto.shipping) {
          shipping.project_detail_id = project_detail_id;
          shipping.created_at = new Date().toISOString();
          shipping.created_by = user_id;
        }
        const data = await queryRunner.manager.insert(
          ProjectShippingEntity,
          createProjectShippingDto.shipping,
        );
      }

      await queryRunner.commitTransaction();
      return createProjectShippingDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findProjectShipping(project_detail_id: number) {
    const data = await this.projectShippingRepository.find({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        project_detail_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_cost: true,
        shipping_date: true,
      },
    });
    return data;
  }
  async updateProjectShipping(
    project_detail_id,
    createProjectShippingDto: CreateProjectShippingDto,
    user_id,
    i18n,
  ) {
    const arrResult = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        Array.isArray(createProjectShippingDto.shipping) &&
        createProjectShippingDto.shipping.length > 0
      ) {
        for (const shipping of createProjectShippingDto.shipping) {
          shipping.project_detail_id = project_detail_id;
          shipping.created_at = new Date().toISOString();
          shipping.created_by = user_id;
        }
        await queryRunner.manager.delete(ProjectShippingEntity, {
          project_detail_id,
        });
        const data = await queryRunner.manager.insert(
          ProjectShippingEntity,
          createProjectShippingDto.shipping,
        );
      }

      await queryRunner.commitTransaction();
      return createProjectShippingDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
