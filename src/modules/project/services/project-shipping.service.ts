import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { Connection } from 'typeorm';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { CreateProjectShippingDto } from '../dto/project-shipping.dto';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';

@Injectable()
export class ProjectShippingService {
  constructor(
    // @InjectRepository(ProjectVariantEntity)
    // private projectVariantRepository: Repository<ProjectVariantEntity>,
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
}
