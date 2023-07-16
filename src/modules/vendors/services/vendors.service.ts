import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { VendorDocumentsEntity } from 'src/entities/vendors/vendor_documents.entity';
import { VendorTypeEntity } from 'src/entities/vendors/vendor_type.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private vendorsRepository: Repository<VendorsEntity>,
    private connection: Connection,
  ) {}
  async create(createVendorDto: CreateVendorDto, user_id, i18n) {
    const code = await this.generateCodeVendor();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vendor = await queryRunner.manager.insert(VendorsEntity, {
        ...createVendorDto,
        created_by: user_id,
        code,
        status: 'Not yet validated',
      });
      for (const documents of createVendorDto.vendor_documents) {
        documents.vendor_id = vendor.raw[0].id;
      }
      for (const type of createVendorDto.vendor_type) {
        type.vendor_id = vendor.raw[0].id;
      }

      await queryRunner.manager.insert(
        VendorDocumentsEntity,
        createVendorDto.vendor_documents,
      );

      await queryRunner.manager.insert(
        VendorTypeEntity,
        createVendorDto.vendor_type,
      );
      await queryRunner.commitTransaction();
      return createVendorDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query) {
    const { page, page_size, sort_by, order_by, status, taxable, keyword } =
      query;
    let orderObj = {};
    switch (sort_by) {
      case 'company_name':
        orderObj = {
          company_name: order_by,
        };
        break;
      case 'pic_full_name':
        orderObj = {
          pic_full_name: order_by,
        };
        break;
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.vendorsRepository.findAndCount({
      select: {
        id: true,
        code: true,
        company_name: true,
        taxable: true,
        pic_full_name: true,
        pic_phone_number: true,
        status: true,
        vendor_type: {
          id: true,
          name: true,
        },
      },
      where: [
        {
          company_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          taxable: taxable ? taxable : Not(IsNull()),
          deleted_at: IsNull(),
        },
        {
          pic_full_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          taxable: taxable ? taxable : Not(IsNull()),
          deleted_at: IsNull(),
        },
      ],
      relations: {
        vendor_type: true,
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

  async findOne(id: number) {
    const data = await this.vendorsRepository.findOne({
      select: {
        id: true,
        code: true,
        status: true,
        company_name: true,
        company_phone_number: true,
        company_address: true,
        taxable: true,
        pic_full_name: true,
        pic_id_number: true,
        pic_phone_number: true,
        pic_email: true,
        vendor_type: { id: true, name: true },
        vendor_documents: {
          id: true,
          type: true,
          file_url: true,
          base_url: true,
        },
      },
      relations: {
        vendor_type: true,
        vendor_documents: true,
      },
      where: { id, deleted_at: IsNull() },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
  async generateCodeVendor() {
    const pad = '0000';
    try {
      const vendor = await this.vendorsRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = vendor[0] ? `${vendor[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw new Error(error);
    }
  }
}
