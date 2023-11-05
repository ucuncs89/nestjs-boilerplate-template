import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository } from 'typeorm';
import { ProjectVendorMaterialFabricDetailEntity } from 'src/entities/project/project_vendor_material_fabric_detail.entity';
import { AppErrorException } from 'src/exceptions/app-exception';
import { ProjectVendorMaterialSamplingDetailDto } from '../dto/project-vendor-material-fabric-sampling.dto';
import { ProjectVendorMaterialAccessoriesSewingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_sewing_detail.entity';
import { ProjectVendorMaterialAccessoriesPackagingDetailEntity } from 'src/entities/project/project_vendor_material_accessories_packaging_detail.entity';
import { ProjectVendorMaterialFinishedGoodDetailEntity } from 'src/entities/project/project_vendor_material_finished_good_detail.entity';

@Injectable()
export class ProjectVendorMaterialSamplingService {
  constructor(
    @InjectRepository(ProjectVendorMaterialFabricDetailEntity)
    private projectVendorMaterialFabricDetailRepository: Repository<ProjectVendorMaterialFabricDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesSewingDetailEntity)
    private projectVendorMaterialAccessoriesSewingDetailRepository: Repository<ProjectVendorMaterialAccessoriesSewingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialAccessoriesPackagingDetailEntity)
    private projectVendorMaterialAccessoriesPackagingDetailRepository: Repository<ProjectVendorMaterialAccessoriesPackagingDetailEntity>,

    @InjectRepository(ProjectVendorMaterialFinishedGoodDetailEntity)
    private projectVendorMaterialFinishedGoodDetailRepository: Repository<ProjectVendorMaterialFinishedGoodDetailEntity>,
  ) {}
  async createVendorMaterialFabricDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const fabric = this.projectVendorMaterialFabricDetailRepository.create({
        ...projectVendorMaterialSamplingDetailDto,
        project_vendor_material_fabric_id: vendor_material_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectVendorMaterialFabricDetailRepository.save(fabric);
      return fabric;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialSewingDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const sewing =
        this.projectVendorMaterialAccessoriesSewingDetailRepository.create({
          ...projectVendorMaterialSamplingDetailDto,
          project_vendor_material_accessories_sewing_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialAccessoriesSewingDetailRepository.save(
        sewing,
      );
      return sewing;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialPackagingDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const packaging =
        this.projectVendorMaterialAccessoriesPackagingDetailRepository.create({
          ...projectVendorMaterialSamplingDetailDto,
          project_vendor_material_accessories_packaging_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialAccessoriesPackagingDetailRepository.save(
        packaging,
      );
      return packaging;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async createVendorMaterialFinishedGoodDetail(
    project_detail_id,
    vendor_material_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const finishedGoods =
        this.projectVendorMaterialFinishedGoodDetailRepository.create({
          ...projectVendorMaterialSamplingDetailDto,
          project_vendor_material_finished_good_id: vendor_material_id,
          created_at: new Date().toISOString(),
          created_by: user_id,
        });
      await this.projectVendorMaterialFinishedGoodDetailRepository.save(
        finishedGoods,
      );
      return finishedGoods;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialFabricDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFabricDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialSamplingDetailDto.vendor_id,
            quantity: projectVendorMaterialSamplingDetailDto.quantity,
            quantity_unit: projectVendorMaterialSamplingDetailDto.quantity_unit,
            price: projectVendorMaterialSamplingDetailDto.price,
            price_unit: projectVendorMaterialSamplingDetailDto.price_unit,
            total_price: projectVendorMaterialSamplingDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialSewingDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesSewingDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialSamplingDetailDto.vendor_id,
            quantity: projectVendorMaterialSamplingDetailDto.quantity,
            quantity_unit: projectVendorMaterialSamplingDetailDto.quantity_unit,
            price: projectVendorMaterialSamplingDetailDto.price,
            price_unit: projectVendorMaterialSamplingDetailDto.price_unit,
            total_price: projectVendorMaterialSamplingDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      console.log(error);

      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialPackagingDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesPackagingDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialSamplingDetailDto.vendor_id,
            quantity: projectVendorMaterialSamplingDetailDto.quantity,
            quantity_unit: projectVendorMaterialSamplingDetailDto.quantity_unit,
            price: projectVendorMaterialSamplingDetailDto.price,
            price_unit: projectVendorMaterialSamplingDetailDto.price_unit,
            total_price: projectVendorMaterialSamplingDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async updateVendorMaterialFinishedGoodDetail(
    project_detail_id,
    vendor_material_detail_id,
    projectVendorMaterialSamplingDetailDto: ProjectVendorMaterialSamplingDetailDto,
    user_id,
    i18n,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFinishedGoodDetailRepository.update(
          {
            id: vendor_material_detail_id,
          },
          {
            vendor_id: projectVendorMaterialSamplingDetailDto.vendor_id,
            quantity: projectVendorMaterialSamplingDetailDto.quantity,
            quantity_unit: projectVendorMaterialSamplingDetailDto.quantity_unit,
            price: projectVendorMaterialSamplingDetailDto.price,
            price_unit: projectVendorMaterialSamplingDetailDto.price_unit,
            total_price: projectVendorMaterialSamplingDetailDto.total_price,
            updated_at: new Date().toISOString(),
            updated_by: user_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialFabricDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFabricDetailRepository.delete({
          project_vendor_material_fabric_id: vendor_material_id,
          id: vendor_material_detail_id,
        });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialSewingDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesSewingDetailRepository.delete(
          {
            project_vendor_material_accessories_sewing_id: vendor_material_id,
            id: vendor_material_detail_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialPackagingDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialAccessoriesPackagingDetailRepository.delete(
          {
            project_vendor_material_accessories_packaging_id:
              vendor_material_id,
            id: vendor_material_detail_id,
          },
        );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async deleteVendorMaterialFinishedGoodDetail(
    vendor_material_id,
    vendor_material_detail_id: number,
  ) {
    try {
      const data =
        await this.projectVendorMaterialFinishedGoodDetailRepository.delete({
          project_vendor_material_finished_good_id: vendor_material_id,
          id: vendor_material_detail_id,
        });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
