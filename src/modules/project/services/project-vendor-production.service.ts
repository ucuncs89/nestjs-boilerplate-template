import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectVendorProductionDto } from '../dto/project-vendor-production.dto';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';

@Injectable()
export class ProjectVendorProductionService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,
    private connection: Connection,
  ) {}

  async createVendorProduction(
    project_detail_id,
    projectVendorProductionDto: ProjectVendorProductionDto,
    user_id,
    i18n,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vendorProduction = await queryRunner.manager.insert(
        ProjectVendorProductionEntity,
        {
          project_detail_id,
          cutting_percentage_of_loss:
            projectVendorProductionDto.cutting_percentage_of_loss,
          sewing_percentage_of_loss:
            projectVendorProductionDto.sewing_percentage_of_loss,
          created_at: new Date().toISOString(),
          created_by: user_id,
        },
      );
      if (
        Array.isArray(projectVendorProductionDto.detail) &&
        projectVendorProductionDto.detail.length > 0
      ) {
        for (const detail of projectVendorProductionDto.detail) {
          detail.project_vendor_production_id = vendorProduction.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectVendorProductionDetailEntity,
          projectVendorProductionDto.detail,
        );
      }

      await queryRunner.commitTransaction();
      return { id: vendorProduction.raw[0].id, ...projectVendorProductionDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findVendorProduction(project_detail_id) {
    const data = await this.projectVendorProductionRepository.findOne({
      select: {
        id: true,
        project_detail_id: true,
        sewing_percentage_of_loss: true,
        cutting_percentage_of_loss: true,
        vendor_production_detail: {
          id: true,
          activity_id: true,
          activity_name: true,
          price: true,
          quantity: true,
          quantity_unit: true,
          vendor_id: true,
          vendor_name: true,
          project_vendor_production_id: true,
        },
      },
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: {
        vendor_production_detail: true,
      },
      order: {
        id: 'DESC',
      },
    });
    return data;
  }
}
