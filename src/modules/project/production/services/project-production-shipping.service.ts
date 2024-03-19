import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, IsNull, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectProductionShippingDto } from '../dto/project-production-shipping.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectProductionShippingPackingDto } from '../dto/project-production-shipping-packing.dto';
import { ProjectShippingPackingEntity } from 'src/entities/project/project_shipping_packing.entity';
import { ProjectShippingPackingDetailEntity } from 'src/entities/project/project_shipping_packing_detail.entity';

@Injectable()
export class ProjectProductionShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    private connection: Connection,
  ) {}
  async findShipping(project_id) {
    const shipping = await this.projectShippingRepository.find({
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        created_at: true,
        added_in_section: true,
        receipt_number: true,
        total_shipping_cost: true,
        packing: {
          id: true,
          project_shipping_id: true,
          variant_id: true,
          variant_name: true,
          total_item: true,
          created_at: true,
          detail: {
            id: true,
            project_shipping_packing_id: true,
            size_ratio: true,
            number_of_item: true,
            created_at: true,
          },
        },
      },
      where: {
        project_id,
        added_in_section: In([StatusProjectEnum.Production]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      relations: { packing: { detail: true } },
    });
    return shipping;
  }
  async createShipping(
    project_id,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id,
    cost_per_item: number,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectProductionShippingDto,
        shipping_cost: cost_per_item,
        added_in_section: StatusProjectEnum.Production,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await this.projectShippingRepository.save(shipping);
      return shipping;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateShipping(
    shipping_id: number,
    projectProductionShippingDto: ProjectProductionShippingDto,
    user_id: number,
    cost_per_item: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
        },
        {
          total_shipping_cost: projectProductionShippingDto.total_shipping_cost,
          shipping_cost: cost_per_item,
          shipping_date: projectProductionShippingDto.shipping_date,
          shipping_name: projectProductionShippingDto.shipping_name,
          shipping_vendor_name:
            projectProductionShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          receipt_number: projectProductionShippingDto.receipt_number,
          send_to: projectProductionShippingDto.send_to,
          relation_id: projectProductionShippingDto.relation_id,
          relation_name: projectProductionShippingDto.relation_name,
        },
      );
      return { id: shipping_id, ...projectProductionShippingDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailShipping(shipping_id: number) {
    const data = await this.projectShippingRepository.findOne({
      where: {
        id: shipping_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deleteShipping(shipping_id) {
    return await this.projectShippingRepository.delete({ id: shipping_id });
  }
  async createPackingList(
    shipping_id: number,
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const packing = await queryRunner.manager.insert(
        ProjectShippingPackingEntity,
        {
          ...projectProductionShippingPackingDto,
          created_by: user_id,
          created_at: new Date().toISOString(),
          project_shipping_id: shipping_id,
        },
      );
      if (
        Array.isArray(projectProductionShippingPackingDto.detail) &&
        projectProductionShippingPackingDto.detail.length > 0
      ) {
        for (const detail of projectProductionShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectProductionShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();
      return { id: packing.raw[0].id, ...projectProductionShippingPackingDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async updatePackingList(
    shipping_id: number,
    packing_id: number,
    projectProductionShippingPackingDto: ProjectProductionShippingPackingDto,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const packing = await queryRunner.manager.update(
        ProjectShippingPackingEntity,
        { id: packing_id },
        {
          variant_name: projectProductionShippingPackingDto.variant_name,
          variant_id: projectProductionShippingPackingDto.variant_id,
          total_item: projectProductionShippingPackingDto.total_item,
          created_by: user_id,
          created_at: new Date().toISOString(),
          project_shipping_id: shipping_id,
        },
      );
      await queryRunner.manager.delete(ProjectShippingPackingDetailEntity, {
        project_shipping_packing_id: packing_id,
      });
      if (
        Array.isArray(projectProductionShippingPackingDto.detail) &&
        projectProductionShippingPackingDto.detail.length > 0
      ) {
        for (const detail of projectProductionShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing_id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectProductionShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();
      return { id: packing_id, ...projectProductionShippingPackingDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deletePackingList(
    shipping_id: number,
    packing_id: number,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const packing = await queryRunner.manager.delete(
        ProjectShippingPackingEntity,
        { id: packing_id },
      );
      await queryRunner.manager.delete(ProjectShippingPackingDetailEntity, {
        project_shipping_packing_id: packing_id,
      });
      await queryRunner.commitTransaction();
      return packing;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findDeliverNoteItem(shipping_id: number, style_name: string) {
    const data = await this.connection.query(`
  select
    psp.variant_id,
    psp.variant_name,
    sum(psp.total_item) as total_item
  from
    project_shipping_packing psp
  where 
    psp.project_shipping_id = ${shipping_id}
  group by
    psp.variant_id,
    psp.variant_name`);

    for (const obj of data) {
      obj.style_name = style_name;
    }
    return data;
  }

  async findDeliverDetail(shipping_id: number) {
    const data = await this.projectShippingRepository.findOne({
      select: {
        id: true,
        project_id: true,
        shipping_name: true,
        shipping_vendor_name: true,
        shipping_date: true,
        shipping_cost: true,
        total_shipping_cost: true,
        created_at: true,
        added_in_section: true,
        receipt_number: true,
        send_to: true,
        relation_id: true,
        relation_name: true,
        project: {
          id: true,
          style_name: true,
        },
      },
      where: { id: shipping_id, deleted_at: IsNull(), deleted_by: IsNull() },
      relations: { project: true },
    });
    const id = data.id.toString().padStart(4, '0'); // Mengonversi ID menjadi string dan menambahkan padding di depan jika kurang dari 4 digit
    const dateParts = data.shipping_date.split('-');
    const formattedDate = dateParts[0] + dateParts[1] + dateParts[2]; // Mengambil bagian tahun, bulan, dan tanggal dari tanggal pengiriman
    const code = `DN-${formattedDate}-${id}`;
    return { ...data, code };
  }
}
