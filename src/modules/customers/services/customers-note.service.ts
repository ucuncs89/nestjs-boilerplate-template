import { Injectable } from '@nestjs/common';

import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';

import { CustomerNotesEntity } from 'src/entities/customers/customer_notes.entity';
import { CreateCustomerNoteDto } from '../dto/create-customer-note.dto';

@Injectable()
export class CustomersNoteService {
  constructor(
    @InjectRepository(CustomerNotesEntity)
    private customerNotesRepository: Repository<CustomerNotesEntity>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  async create(
    createCustomerNoteDto: CreateCustomerNoteDto,
    customer_id,
    user_id,
    i18n,
  ) {
    try {
      const note = this.customerNotesRepository.create({
        notes: createCustomerNoteDto.note,
        customer_id,
        created_by: user_id,
      });
      await this.customerNotesRepository.save(note);
      return note;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { page, page_size, customer_id, user_id } = query;
    const results = await this.connection.query(`select
    cn.id,
    cn.customer_id,
    cn.notes as note,
    cn.created_at,
    u.full_name as owner_name,
    cn.created_by,
    case
      when cn.created_by = ${user_id} then true
      else 
      false
    end is_mine
  from
    customer_notes cn
  left join users u on
    u.id = cn.created_by
  where
    cn.customer_id = ${customer_id}
    and cn.deleted_by is null
    and cn.deleted_at is null
  order by
    cn.id desc
      offset ${page}
  limit ${page_size}
  `);
    const count_all = await this.connection.query(`select
	count(*) as count_data
from
	(
	select
		cn.id,
		cn.customer_id,
		cn.notes as note,
		cn.created_at,
		u.full_name as owner_name
	from
		customer_notes cn
	left join users u on
		u.id = cn.created_by
	where
		cn.customer_id = ${customer_id}
		and cn.deleted_by is null
		and cn.deleted_at is null
	order by
		cn.created_at desc
      ) as raw
`);
    const total_data = count_all[0] ? parseInt(count_all[0].count_data) : 0;
    return {
      results,
      total_data,
    };
  }

  async remove(customer_id, note_id, user_id) {
    const customer = await this.customerNotesRepository.findOne({
      where: {
        customer_id,
        id: note_id,
        created_by: user_id,
      },
      select: { id: true, deleted_at: true, deleted_by: true },
    });
    if (!customer) {
      throw new AppErrorNotFoundException('Not Found');
    }
    try {
      customer.deleted_at = new Date().toISOString();
      customer.deleted_by = user_id;
      this.customerNotesRepository.save(customer);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
