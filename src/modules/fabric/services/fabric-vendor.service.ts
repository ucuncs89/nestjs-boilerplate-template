import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, ILike, IsNull, Not, Raw, Repository } from 'typeorm';
import { FabricVendorEntity } from '../../../entities/fabric/fabric_vendor.entity';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { CreateFabricVendorDto } from '../dto/create-fabric-vendor.dto';
import { FabricVendorColorEntity } from '../../../entities/fabric/fabric_vendor_color.entity';
import { FabricVendorDocumentEntity } from '../../../entities/fabric/fabric_vendor_document.entity';
import { UpdateFabricVendorDto } from '../dto/update-fabric-vendor.dto';

@Injectable()
export class FabricVendorService {
  constructor(
    @InjectRepository(FabricVendorEntity)
    private fabricVendorRepository: Repository<FabricVendorEntity>,
    private connection: Connection,
  ) {}

  async create(
    fabric_id: number,
    createFabricVendorDto: CreateFabricVendorDto,
    user_id,
    i18n,
  ) {
    const code = await this.generateCodeFabricVendor();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const fabricVendor = await queryRunner.manager.insert(
        FabricVendorEntity,
        {
          ...createFabricVendorDto,
          created_by: user_id,
          code,
          fabric_id,
        },
      );
      for (const color of createFabricVendorDto.color) {
        color.fabric_vendor_id = fabricVendor.raw[0].id;
      }
      for (const files of createFabricVendorDto.files) {
        files.fabric_vendor_id = fabricVendor.raw[0].id;
      }

      await queryRunner.manager.insert(
        FabricVendorColorEntity,
        createFabricVendorDto.color,
      );

      await queryRunner.manager.insert(
        FabricVendorDocumentEntity,
        createFabricVendorDto.files,
      );
      await queryRunner.commitTransaction();
      return { id: fabricVendor.raw[0].id, ...createFabricVendorDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async findAll(query) {
    const { fabric_id, page, page_size, sort_by, order_by, keyword } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'name':
        orderObj = {
          name: order_by,
        };
        break;
      case 'code':
        orderObj = {
          code: order_by,
        };
        break;
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.fabricVendorRepository.findAndCount({
      cache: { id: 'fabricVendor', milliseconds: 1000 },
      select: {
        id: true,
        code: true,
        fabric_id: true,
        vendor_id: true,
        content: true,
        weight: true,
        width: true,
        minimum_order_quantity: true,
        stock_availability: true,
        color: {
          id: true,
          color_name: true,
          color_code: true,
        },
        vendor: { id: true, company_name: true },
        files: { id: true, base_url: true, file_url: true },
      },
      where: [
        {
          vendor: keyword
            ? { company_name: ILike(`%${keyword}%`) }
            : Not(IsNull()),
          deleted_at: IsNull(),
          fabric_id,
        },
      ],
      relations: {
        color: true,
        vendor: true,
        files: true,
      },
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      data: result,
      total_data: total,
    };
  }
  async findOne(fabric_id, fabric_vendor_id, i18n) {
    const data = await this.fabricVendorRepository.findOne({
      where: { id: fabric_vendor_id, deleted_at: IsNull(), fabric_id },
      select: {
        id: true,
        code: true,
        fabric_id: true,
        vendor_id: true,
        content: true,
        weight: true,
        width: true,
        minimum_order_quantity: true,
        stock_availability: true,
        color: {
          id: true,
          color_name: true,
          color_code: true,
        },
        files: {
          id: true,
          base_url: true,
          file_url: true,
        },
        vendor: { id: true, company_name: true },
      },
      relations: {
        files: true,
        color: true,
        vendor: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(
    fabric_id,
    fabric_vendor_id,
    updateFabricVendorDto: UpdateFabricVendorDto,
    user_id,
    i18n,
  ) {
    const fabricVendor = await this.fabricVendorRepository.findOne({
      where: {
        fabric_id,
        id: fabric_vendor_id,
      },
      select: { id: true, deleted_at: true, deleted_by: true },
    });
    if (!fabricVendor) {
      throw new AppErrorNotFoundException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(FabricVendorEntity, fabric_vendor_id, {
        vendor_id: updateFabricVendorDto.vendor_id,
        content: updateFabricVendorDto.content,
        weight: updateFabricVendorDto.weight,
        width: updateFabricVendorDto.width,
        minimum_order_quantity: updateFabricVendorDto.minimum_order_quantity,
        stock_availability: updateFabricVendorDto.stock_availability,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      });
      for (const color of updateFabricVendorDto.color) {
        color.fabric_vendor_id = fabric_vendor_id;
      }
      for (const files of updateFabricVendorDto.files) {
        files.fabric_vendor_id = fabric_vendor_id;
      }
      await queryRunner.manager.delete(FabricVendorColorEntity, {
        fabric_vendor_id,
      });
      await queryRunner.manager.delete(FabricVendorDocumentEntity, {
        fabric_vendor_id,
      });
      await queryRunner.manager.insert(
        FabricVendorColorEntity,
        updateFabricVendorDto.color,
      );
      await queryRunner.manager.insert(
        FabricVendorDocumentEntity,
        updateFabricVendorDto.files,
      );
      await queryRunner.commitTransaction();
      return { id: fabric_vendor_id, ...updateFabricVendorDto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async remove(fabric_id, fabric_vendor_id, user_id, i18n) {
    const fabricVendor = await this.fabricVendorRepository.findOne({
      where: {
        id: fabric_vendor_id,
        fabric_id,
      },
      select: { id: true, deleted_at: true, deleted_by: true },
    });
    if (!fabricVendor) {
      throw new AppErrorNotFoundException('Not Found');
    }

    try {
      fabricVendor.deleted_at = new Date().toISOString();
      fabricVendor.deleted_by = user_id;
      this.fabricVendorRepository.save(fabricVendor);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeFabricVendor() {
    const pad = '0000';
    try {
      const fabric = await this.fabricVendorRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = fabric[0] ? `${fabric[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }
}
