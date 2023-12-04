import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection, IsNull, Repository } from 'typeorm';

@Injectable()
export class ProjectProductionTrackingService {
  constructor(
    @InjectRepository(ProjectVendorProductionEntity)
    private projectVendorProductionRepository: Repository<ProjectVendorProductionEntity>,
    @InjectRepository(ProjectVendorProductionDetailEntity)
    private projectVendorProductionDetailRepository: Repository<ProjectVendorProductionDetailEntity>,

    private connection: Connection,
  ) {}
  async updateIsCompletedProduction(
    vendor_production_detail_id,
    production_is_completed,
    user_id,
  ) {
    try {
      const data = await this.projectVendorProductionDetailRepository.update(
        {
          id: vendor_production_detail_id,
          deleted_at: IsNull(),
          deleted_by: IsNull(),
        },
        {
          production_is_completed,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
