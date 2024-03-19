import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, IsNull, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectReturShippingDto } from '../dto/project-retur-shipping.dto';
import { StatusProjectEnum } from '../../general/dto/get-list-project.dto';
import { ProjectReturShippingPackingDto } from '../dto/project-retur-shipping-packing.dto';
import { ProjectShippingPackingEntity } from 'src/entities/project/project_shipping_packing.entity';
import { ProjectShippingPackingDetailEntity } from 'src/entities/project/project_shipping_packing_detail.entity';

@Injectable()
export class ProjectReturShippingService {
  constructor(
    @InjectRepository(ProjectShippingEntity)
    private projectShippingRepository: Repository<ProjectShippingEntity>,

    private connection: Connection,
  ) {}
  async findShipping(project_id: number, retur_id: number) {
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
        added_in_section: In([StatusProjectEnum.Retur]),
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        retur_id,
      },
      relations: { packing: { detail: true } },
    });
    return shipping;
  }
  async createShipping(
    project_id,
    projectReturShippingDto: ProjectReturShippingDto,
    user_id,
    retur_id: number,
  ) {
    try {
      const shipping = this.projectShippingRepository.create({
        ...projectReturShippingDto,
        added_in_section: StatusProjectEnum.Retur,
        project_id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        retur_id,
      });
      await this.projectShippingRepository.save(shipping);
      return shipping;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async updateShipping(
    shipping_id: number,
    projectReturShippingDto: ProjectReturShippingDto,
    user_id: number,
    retur_id: number,
  ) {
    try {
      await this.projectShippingRepository.update(
        {
          id: shipping_id,
          retur_id,
        },
        {
          shipping_cost: projectReturShippingDto.shipping_cost,
          shipping_date: projectReturShippingDto.shipping_date,
          shipping_name: projectReturShippingDto.shipping_name,
          shipping_vendor_name: projectReturShippingDto.shipping_vendor_name,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          receipt_number: projectReturShippingDto.receipt_number,
          send_to: projectReturShippingDto.send_to,
          relation_id: projectReturShippingDto.relation_id,
          relation_name: projectReturShippingDto.relation_name,
        },
      );
      return { id: shipping_id, ...projectReturShippingDto };
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
    projectReturShippingPackingDto: ProjectReturShippingPackingDto,
    user_id: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const packing = await queryRunner.manager.insert(
        ProjectShippingPackingEntity,
        {
          ...projectReturShippingPackingDto,
          created_by: user_id,
          created_at: new Date().toISOString(),
          project_shipping_id: shipping_id,
        },
      );
      if (
        Array.isArray(projectReturShippingPackingDto.detail) &&
        projectReturShippingPackingDto.detail.length > 0
      ) {
        for (const detail of projectReturShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing.raw[0].id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectReturShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();
      return { id: packing.raw[0].id, ...projectReturShippingPackingDto };
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
    projectReturShippingPackingDto: ProjectReturShippingPackingDto,
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
          variant_name: projectReturShippingPackingDto.variant_name,
          variant_id: projectReturShippingPackingDto.variant_id,
          total_item: projectReturShippingPackingDto.total_item,
          created_by: user_id,
          created_at: new Date().toISOString(),
          project_shipping_id: shipping_id,
        },
      );
      await queryRunner.manager.delete(ProjectShippingPackingDetailEntity, {
        project_shipping_packing_id: packing_id,
      });
      if (
        Array.isArray(projectReturShippingPackingDto.detail) &&
        projectReturShippingPackingDto.detail.length > 0
      ) {
        for (const detail of projectReturShippingPackingDto.detail) {
          detail.project_shipping_packing_id = packing_id;
        }
        await queryRunner.manager.insert(
          ProjectShippingPackingDetailEntity,
          projectReturShippingPackingDto.detail,
        );
      }
      await queryRunner.commitTransaction();
      return { id: packing_id, ...projectReturShippingPackingDto };
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
    const code = `DN-RETUR-${formattedDate}-${id}`;
    return { ...data, code };
  }
}
