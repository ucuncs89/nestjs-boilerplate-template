import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectCostingVendorMaterialService } from '../../costing/services/project-costing-vendor-material.service';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';

@Injectable()
export class ProjectPlanningService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private projectCostingVendorMaterialService: ProjectCostingVendorMaterialService,
    private connection: Connection,
  ) {}
  async generatePlanning(project_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: { id: true, status: true },
    });

    if (
      project.status === StatusProjectEnum.Costing ||
      project.status === StatusProjectEnum.Sampling
    ) {
      const material =
        await this.projectCostingVendorMaterialService.findVendorMaterialByProjectId(
          project_id,
        );
      const duplicate = await this.duplicateMaterialVendor(
        project_id,
        material,
      );
      return duplicate;
    } else {
      return true;
    }
  }
  async duplicateMaterialVendor(
    project_id: number,
    arrMaterialVendor?: ProjectVendorMaterialEntity[],
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const vendorMaterial of arrMaterialVendor) {
        vendorMaterial.section_type = StatusProjectEnum.Planning;
        const material = await queryRunner.manager.insert(
          ProjectVendorMaterialEntity,
          { ...vendorMaterial, created_at: new Date().toISOString() },
        );
        if (
          Array.isArray(vendorMaterial.detail) &&
          vendorMaterial.detail.length > 0
        )
          for (const detail of vendorMaterial.detail) {
            detail.project_vendor_material_id = material.raw[0].id;
            await queryRunner.manager.insert(
              ProjectVendorMaterialDetailEntity,
              { ...detail, created_at: new Date().toISOString() },
            );
          }
      }
      const update = await queryRunner.manager.update(
        ProjectEntity,
        { id: project_id },
        { status: StatusProjectEnum.Planning },
      );
      await queryRunner.commitTransaction();
      return { arrMaterialVendor, update };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
