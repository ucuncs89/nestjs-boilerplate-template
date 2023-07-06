import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersEntity } from 'src/entities/customers/customers.entity';
import { Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import { AppErrorException } from 'src/exceptions/app-exception';
import { CustomerDocumentsEntity } from 'src/entities/customers/customer_documents.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private customersRepository: Repository<CustomersEntity>,
    private connection: Connection,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user_id, i18n) {
    const code = await this.generateCodeCustomer();
    // const data = await this.customersRepository.insert({
    //   company_address: createCustomerDto.company_address,
    //   company_name: createCustomerDto.company_name,
    //   company_phone_number: createCustomerDto.company_phone_number,
    //   customer_documents: createCustomerDto.customer_documents,
    //   pic_email: createCustomerDto.pic_email,
    //   pic_full_name: createCustomerDto.pic_full_name,
    //   pic_id_number: createCustomerDto.pic_id_number,
    //   pic_phone_number: createCustomerDto.pic_phone_number,
    //   taxable: createCustomerDto.taxable,
    //   created_by: user_id,
    //   code,
    //   status: 'Not yet validated',
    // });

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

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  async remove(id: number) {
    return `This action removes a #${id} customer`;
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
      console.log(error);
      throw error;
    }
  }
}
