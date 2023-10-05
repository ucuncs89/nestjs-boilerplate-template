import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection } from 'typeorm';
import { ProjectVendorProductionDto } from '../dto/project-vendor-production.dto';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';

@Injectable()
export class ProjectVendorProductionService {
  constructor(
    // @InjectRepository(ProjectVariantEntity)
    // private projectVariantRepository: Repository<ProjectVariantEntity>,
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
}
