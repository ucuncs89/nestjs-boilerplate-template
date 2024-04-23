import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/project/project.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectVendorMaterialEntity } from 'src/entities/project/project_vendor_material.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectVendorMaterialDetailEntity } from 'src/entities/project/project_vendor_material_detail.entity';
import { ProjectCostingMaterialService } from '../../costing/services/project-costing-material.service';
import { ProjectMaterialItemEntity } from 'src/entities/project/project_material_item.entity';
import { ProjectCostingVendorProductionService } from '../../costing/services/project-costing-vendor-production.service';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectVendorProductionDetailEntity } from 'src/entities/project/project_vendor_production_detail.entity';
import { ProjectCostingShippingService } from '../../costing/services/project-costing-shipping.service';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectCostingAdditionalCostService } from '../../costing/services/project-costing-additional-cost.service';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { ProjectCostingPriceService } from '../../costing/services/project-costing-price.service';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectSamplingService } from '../../sampling/services/project-sampling.service';
import { ProjectSamplingEntity } from 'src/entities/project/project_sampling.entity';

@Injectable()
export class ProjectPlanningService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private projectCostingMaterialService: ProjectCostingMaterialService,
    private projectCostingVendorProductionService: ProjectCostingVendorProductionService,
    private projectCostingShippingService: ProjectCostingShippingService,
    private projectCostingAdditionalCostService: ProjectCostingAdditionalCostService,
    private projectCostingPriceService: ProjectCostingPriceService,
    private projectSamplingService: ProjectSamplingService,
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
        await this.projectCostingMaterialService.findVendorMaterialCosting(
          project_id,
        );
      const production =
        await this.projectCostingVendorProductionService.findProductionCosting(
          project_id,
        );
      const shipping =
        await this.projectCostingShippingService.findShippingCosting(
          project_id,
        );
      const additionalCost =
        await this.projectCostingAdditionalCostService.findAdditionalCosting(
          project_id,
        );
      const price = await this.projectCostingPriceService.findPriceCosting(
        project_id,
      );
      const sampling = await this.projectSamplingService.findSamplingAll(
        project_id,
      );
      const duplicate = await this.duplicateCostingToPlanning(
        project_id,
        material,
        production,
        shipping,
        additionalCost,
        sampling,
        price,
      );
      return {
        material,
        production,
        shipping,
        additionalCost,
        sampling,
        price,
        duplicate,
      };
    } else {
      return true;
    }
  }

  async duplicateCostingToPlanning(
    project_id: number,
    arrMaterialItem?: ProjectMaterialItemEntity[],
    arrProduction?: ProjectVendorProductionEntity[],
    arrShipping?: ProjectShippingEntity[],
    arrAdditionalCost?: ProjectAdditionalCostEntity[],
    arrSampling?: ProjectSamplingEntity[],
    objPrice?: ProjectPriceEntity,
  ) {
    const arrResult: any[] = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (Array.isArray(arrMaterialItem) && arrMaterialItem.length > 0) {
        for (const material of arrMaterialItem) {
          material.added_in_section = StatusProjectEnum.Planning;
          material.costing_material_item_id = material.id;

          const materialItem = await queryRunner.manager.insert(
            ProjectMaterialItemEntity,
            { ...material, created_at: new Date().toISOString() },
          );

          //update planning_material_item_id sebelumnya
          await queryRunner.manager.update(
            ProjectMaterialItemEntity,
            { id: material.id },
            { planning_material_item_id: materialItem.raw[0].id },
          );
          arrResult.push({ material_item: materialItem.raw[0].id });
          if (
            Array.isArray(material.vendor_material) &&
            material.vendor_material.length > 0
          )
            for (const vendor_material of material.vendor_material) {
              vendor_material.project_material_item_id = materialItem.raw[0].id;
              vendor_material.added_in_section = StatusProjectEnum.Planning;
              const insertVendorMaterial = await queryRunner.manager.insert(
                ProjectVendorMaterialEntity,
                { ...vendor_material, created_at: new Date().toISOString() },
              );
              if (
                Array.isArray(vendor_material.detail) &&
                vendor_material.detail.length > 0
              ) {
                for (const detail of vendor_material.detail) {
                  detail.project_vendor_material_id =
                    insertVendorMaterial.raw[0].id;
                  await queryRunner.manager.insert(
                    ProjectVendorMaterialDetailEntity,
                    {
                      ...detail,
                      created_at: new Date().toISOString(),
                    },
                  );
                }
              }
            }
        }
      }

      if (Array.isArray(arrProduction) && arrProduction.length > 0) {
        for (const productionVendor of arrProduction) {
          productionVendor.added_in_section = StatusProjectEnum.Planning;
          productionVendor.costing_project_vendor_production_id =
            productionVendor.id;
          const insertProduction = await queryRunner.manager.insert(
            ProjectVendorProductionEntity,
            {
              ...productionVendor,
              created_at: new Date().toISOString(),
              added_in_section: StatusProjectEnum.Planning,
            },
          );

          //update planning_project_vendor_production_id sebelumnya

          arrResult.push({ production_id: insertProduction.raw[0].id });
          if (
            Array.isArray(productionVendor.vendor_production_detail) &&
            productionVendor.vendor_production_detail.length > 0
          ) {
            for (const detail of productionVendor.vendor_production_detail) {
              detail.added_in_section = StatusProjectEnum.Planning;
              delete detail.id;
              delete detail.project_vendor_production_id;
              await queryRunner.manager.insert(
                ProjectVendorProductionDetailEntity,
                {
                  ...detail,
                  added_in_section: StatusProjectEnum.Planning,
                  project_vendor_production_id: insertProduction.raw[0].id,
                  created_at: new Date().toISOString(),
                },
              );
            }
          }
          await queryRunner.manager.update(
            ProjectVendorProductionEntity,
            { id: productionVendor.id },
            {
              planning_project_vendor_production_id: insertProduction.raw[0].id,
            },
          );
        }
      }

      if (Array.isArray(arrShipping) && arrShipping.length > 0) {
        for (const shipping of arrShipping) {
          shipping.added_in_section = StatusProjectEnum.Planning;
          shipping.costing_project_shipping_id = shipping.id;
          const insertShipping = await queryRunner.manager.insert(
            ProjectShippingEntity,
            {
              ...shipping,
              created_at: new Date().toISOString(),
            },
          );
          //update shipping sebelumnya
          await queryRunner.manager.update(
            ProjectShippingEntity,
            { id: shipping.id },
            { planning_project_shipping_id: insertShipping.raw[0].id },
          );
          arrResult.push({ shipping_id: insertShipping.raw[0].id });
        }
      }

      if (Array.isArray(arrAdditionalCost) && arrAdditionalCost.length > 0) {
        for (const additionalCost of arrAdditionalCost) {
          additionalCost.added_in_section = StatusProjectEnum.Planning;
          additionalCost.costing_project_additional_cost_id = additionalCost.id;
          const additionalInsert = await queryRunner.manager.insert(
            ProjectAdditionalCostEntity,
            {
              ...additionalCost,
              created_at: new Date().toISOString(),
            },
          );
          //update additionalcost sebelumnya
          await queryRunner.manager.update(
            ProjectAdditionalCostEntity,
            { id: additionalCost.id },
            { planning_project_additional_cost_id: additionalInsert.raw[0].id },
          );
          arrResult.push({ addtional_id: additionalInsert.raw[0].id });
        }
      }

      if (Array.isArray(arrSampling) && arrSampling.length > 0) {
        for (const sampling of arrSampling) {
          sampling.added_in_section = StatusProjectEnum.Planning;
          sampling.costing_project_project_sampling_id = sampling.id;
          const samplingInsert = await queryRunner.manager.insert(
            ProjectSamplingEntity,
            { ...sampling, created_at: new Date().toISOString() },
          );
          console.log(samplingInsert);

          await queryRunner.manager.update(
            ProjectSamplingEntity,
            { id: sampling.id },
            {
              planning_project_project_sampling_id: samplingInsert.raw[0].id,
            },
          );
          arrResult.push({ sampling_id: samplingInsert.raw[0].id });
        }
      }

      if (objPrice) {
        objPrice.added_in_section = StatusProjectEnum.Planning;
        await queryRunner.manager.insert(ProjectPriceEntity, { ...objPrice });
      }
      const update = await queryRunner.manager.update(
        ProjectEntity,
        { id: project_id },
        { status: StatusProjectEnum.Planning },
      );
      await queryRunner.commitTransaction();
      return { new: arrResult, update };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async publishPlanning(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id, deleted_at: IsNull(), deleted_by: IsNull() },
    });
    if (project.status === StatusProjectEnum.Planning) {
      const data = await this.projectRepository.update(
        { id: project_id },
        { can_production: true, updated_by: user_id },
      );
      return data;
    }
    return { data: 'Already' };
  }
}
