import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from '../../../entities/customers/customers.entity';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { CustomerDocumentsEntity } from '../../../entities/customers/customer_documents.entity';
import { ValidationCustomerDto } from '../dto/validation-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private customersRepository: Repository<CustomersEntity>,
    private connection: Connection,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user_id, i18n) {
    const code = await this.generateCodeCustomer();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const customer = await queryRunner.manager.insert(CustomersEntity, {
        ...createCustomerDto,
        created_by: user_id,
        code,
        status: 'Not yet validated',
      });
      for (const documents of createCustomerDto.customer_documents) {
        documents.customer_id = customer.raw[0].id;
      }
      await queryRunner.manager.insert(
        CustomerDocumentsEntity,
        createCustomerDto.customer_documents,
      );
      await queryRunner.commitTransaction();
      return createCustomerDto;
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
      default:
        orderObj = {
          id: order_by,
        };
        break;
    }
    const [result, total] = await this.customersRepository.findAndCount({
      select: {
        id: true,
        code: true,
        company_name: true,
        taxable: true,
        pic_full_name: true,
        pic_phone_number: true,
        status: true,
        last_order: true,
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
    const data = await this.customersRepository.findOne({
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
        customer_documents: {
          id: true,
          type: true,
          file_url: true,
          base_url: true,
        },
      },
      relations: {
        customer_documents: true,
      },
      where: { id, deleted_at: IsNull() },
    });
    return data;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto, user_id) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(CustomersEntity, id, {
        company_address: updateCustomerDto.company_address,
        company_name: updateCustomerDto.company_name,
        company_phone_number: updateCustomerDto.company_phone_number,
        pic_email: updateCustomerDto.pic_email,
        pic_full_name: updateCustomerDto.pic_full_name,
        pic_id_number: updateCustomerDto.pic_id_number,
        pic_phone_number: updateCustomerDto.pic_phone_number,
        taxable: updateCustomerDto.taxable,
        updated_at: new Date().toISOString(),
        updated_by: user_id,
      });
      for (const documents of updateCustomerDto.customer_documents) {
        documents.customer_id = id;
      }
      await queryRunner.manager.delete(CustomerDocumentsEntity, {
        customer_id: id,
      });
      await queryRunner.manager.insert(
        CustomerDocumentsEntity,
        updateCustomerDto.customer_documents,
      );
      await queryRunner.commitTransaction();
      return updateCustomerDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, user_id) {
    const customer = await this.customersRepository.findOne({
      where: {
        id,
      },
      select: { id: true, deleted_at: true, deleted_by: true },
    });
    if (!customer) {
      throw new AppErrorNotFoundException('Not Found');
    }
    try {
      customer.deleted_at = new Date().toISOString();
      customer.deleted_by = user_id;
      this.customersRepository.save(customer);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async generateCodeCustomer() {
    const pad = '0000';
    try {
      const customer = await this.customersRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = customer[0] ? `${customer[0].id + 1}` : '1';
      return pad.substring(0, pad.length - id.length) + id;
    } catch (error) {
      throw error;
    }
  }

  async validateCustomer(
    id: number,
    validationCustomerDto: ValidationCustomerDto,
    user_id: number,
  ) {
    const customer = await this.customersRepository.findOne({
      select: {
        id: true,
        status: true,
        updated_at: true,
      },
      where: {
        id: id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!customer) {
      throw new AppErrorNotFoundException();
    }
    customer.updated_at = new Date().toISOString();
    customer.updated_by = user_id;
    customer.status = validationCustomerDto.status;
    this.customersRepository.save(customer);
    return { id, status: customer.status };
  }
}
