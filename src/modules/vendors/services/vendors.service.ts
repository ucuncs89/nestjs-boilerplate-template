import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorsEntity } from '../../../entities/vendors/vendors.entity';
import { Connection, ILike, In, IsNull, Not, Raw, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { VendorDocumentsEntity } from '../../../entities/vendors/vendor_documents.entity';
import { VendorTypeEntity } from '../../../entities/vendors/vendor_type.entity';
import { ValidationVendorDto } from '../dto/validation-vendor.dto';
import { RolesPermissionGuard } from '../../../modules/roles/roles-permission';
import { Role } from '../../../modules/roles/enum/role.enum';
import { ActivationVendorDto } from '../dto/activation-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private vendorsRepository: Repository<VendorsEntity>,
    private connection: Connection,

    private readonly rolePermissionGuard: RolesPermissionGuard,
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
        created_at: new Date().toISOString(),
      });
      if (createVendorDto.vendor_documents) {
        for (const documents of createVendorDto.vendor_documents) {
          documents.vendor_id = vendor.raw[0].id;
        }
        await queryRunner.manager.insert(
          VendorDocumentsEntity,
          createVendorDto.vendor_documents,
        );
      }
      if (createVendorDto.vendor_type) {
        for (const type of createVendorDto.vendor_type) {
          type.vendor_id = vendor.raw[0].id;
        }
        await queryRunner.manager.insert(
          VendorTypeEntity,
          createVendorDto.vendor_type,
        );
      }

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
    const {
      page,
      page_size,
      sort_by,
      order_by,
      status,
      taxable,
      keyword,
      type,
      is_active,
      city_id,
      province_id,
    } = query;
    let active: any;
    switch (is_active) {
      case 'true':
        active = true;
        break;
      case 'false':
        active = false;
        break;
      default:
        active = [];
        break;
    }
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
      case 'status':
        orderObj = {
          status: order_by,
        };
        break;
      case 'code':
        orderObj = {
          code: order_by,
        };
        break;
      case 'is_active':
        orderObj = {
          is_active: order_by,
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
        province_id: true,
        city_id: true,
        is_active: true,
        vendor_type: {
          id: true,
          name: true,
        },
        province: {
          id: true,
          name: true,
          code: true,
        },
        city: {
          id: true,
          name: true,
          code: true,
          province_id: true,
        },
      },
      where: [
        {
          company_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          taxable: taxable ? taxable : Not(IsNull()),
          deleted_at: IsNull(),
          is_active: is_active ? active : Not(In(active)),
          province_id: province_id ? province_id : Not(In([])),
          city_id: city_id ? city_id : Not(In([])),
          vendor_type: type
            ? {
                name: Raw(
                  (alias) => `LOWER(${alias}) = '${type.toLowerCase()}'`,
                ),
              }
            : {},
        },
        {
          pic_full_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          status: status ? status : Not(IsNull()),
          taxable: taxable ? taxable : Not(IsNull()),
          deleted_at: IsNull(),
          is_active: is_active ? active : Not(In(active)),
          province_id: province_id ? province_id : Not(In([])),
          city_id: city_id ? city_id : Not(In([])),
          vendor_type: type
            ? {
                name: Raw(
                  (alias) => `LOWER(${alias}) = '${type.toLowerCase()}'`,
                ),
              }
            : {},
        },
      ],
      relations: {
        vendor_type: true,
        province: true,
        city: true,
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
        bank_account_holder_name: true,
        bank_account_number: true,
        bank_name: true,
        npwp_number: true,
        province_id: true,
        is_active: true,
        city_id: true,
        city: {
          id: true,
          name: true,
          code: true,
          province_id: true,
        },
        province: {
          id: true,
          name: true,
          code: true,
        },
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
        province: true,
        city: true,
      },
      where: { id, deleted_at: IsNull() },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto, user_id) {
    const vendor = await this.vendorsRepository.findOne({
      where: {
        id,
      },
      select: { id: true, deleted_at: true, deleted_by: true, status: true },
    });
    if (!vendor) {
      throw new AppErrorNotFoundException('Not Found');
    }
    if (vendor.status === 'Validated') {
      await this.rolePermissionGuard.canActionByRoles(user_id, [
        Role.SUPERADMIN,
        Role.FINANCE,
      ]);
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(VendorsEntity, id, {
        company_address: updateVendorDto.company_address,
        company_name: updateVendorDto.company_name,
        company_phone_number: updateVendorDto.company_phone_number,
        pic_email: updateVendorDto.pic_email,
        pic_full_name: updateVendorDto.pic_full_name,
        pic_id_number: updateVendorDto.pic_id_number,
        pic_phone_number: updateVendorDto.pic_phone_number,
        taxable: updateVendorDto.taxable,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
        bank_account_holder_name: updateVendorDto.bank_account_holder_name,
        bank_account_number: updateVendorDto.bank_account_number,
        npwp_number: updateVendorDto.npwp_number,
        bank_name: updateVendorDto.bank_name,
        province_id: updateVendorDto.province_id,
        city_id: updateVendorDto.city_id,
      });
      for (const documents of updateVendorDto.vendor_documents) {
        documents.vendor_id = id;
      }
      for (const type of updateVendorDto.vendor_type) {
        type.vendor_id = id;
      }
      await queryRunner.manager.delete(VendorDocumentsEntity, {
        vendor_id: id,
      });
      await queryRunner.manager.delete(VendorTypeEntity, {
        vendor_id: id,
      });
      await queryRunner.manager.insert(
        VendorTypeEntity,
        updateVendorDto.vendor_type,
      );
      await queryRunner.manager.insert(
        VendorDocumentsEntity,
        updateVendorDto.vendor_documents,
      );
      await queryRunner.commitTransaction();
      return updateVendorDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, user_id) {
    const vendor = await this.vendorsRepository.findOne({
      where: {
        id,
      },
      select: { id: true, deleted_at: true, deleted_by: true, status: true },
    });
    if (!vendor) {
      throw new AppErrorNotFoundException('Not Found');
    }
    if (vendor.status === 'Validated') {
      await this.rolePermissionGuard.canActionByRoles(user_id, [
        Role.SUPERADMIN,
        Role.FINANCE,
      ]);
    }
    try {
      vendor.deleted_at = new Date().toISOString();
      vendor.deleted_by = user_id;
      this.vendorsRepository.save(vendor);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
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
  async validateVendor(
    id: number,
    validationVendorDto: ValidationVendorDto,
    user_id: number,
  ) {
    const vendor = await this.vendorsRepository.findOne({
      select: {
        id: true,
        status: true,
        updated_at: true,
        company_name: true,
      },
      where: {
        id: id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!vendor) {
      throw new AppErrorNotFoundException();
    }
    vendor.updated_at = new Date().toISOString();
    vendor.updated_by = user_id;
    vendor.status = validationVendorDto.status;
    this.vendorsRepository.save(vendor);
    return { id, status: vendor.status, company_name: vendor.company_name };
  }
  async activationVendor(
    id: number,
    activationVendorDto: ActivationVendorDto,
    user_id,
  ) {
    const vendor = await this.vendorsRepository.findOne({
      select: {
        id: true,
        status: true,
        updated_at: true,
        company_name: true,
      },
      where: {
        id: id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!vendor) {
      throw new AppErrorNotFoundException();
    }
    vendor.updated_at = new Date().toISOString();
    vendor.updated_by = user_id;
    vendor.is_active = activationVendorDto.is_active;
    this.vendorsRepository.save(vendor);
    return { id, status: vendor.is_active, company_name: vendor.company_name };
  }

  async findByName(company_name: string) {
    const data = await this.vendorsRepository
      .createQueryBuilder()
      .where('LOWER(company_name) = LOWER(:company_name)', { company_name })
      .andWhere('deleted_at is null')
      .getOne();
    return data;
  }
}
