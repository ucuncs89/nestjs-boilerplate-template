import { Injectable } from '@nestjs/common';

import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';

import { VendorNotesEntity } from 'src/entities/vendors/vendor_notes.entity';
import { CreateVendorNoteDto } from '../dto/create-vendor-note.dto';

@Injectable()
export class VendorsNoteService {
  constructor(
    @InjectRepository(VendorNotesEntity)
    private vendorNotesRepository: Repository<VendorNotesEntity>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  async create(
    createVendorNoteDto: CreateVendorNoteDto,
    vendor_id,
    user_id,
    i18n,
  ) {
    try {
      const note = this.vendorNotesRepository.create({
        notes: createVendorNoteDto.note,
        vendor_id,
        created_by: user_id,
      });
      await this.vendorNotesRepository.save(note);
      return note;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query) {
    const { page, page_size, vendor_id, user_id } = query;
    const results = await this.connection.query(`select
    vn.id,
    vn.vendor_id,
    vn.notes as note,
    vn.created_at,
    u.full_name as owner_name,
    vn.created_by,
    case
      when vn.created_by = ${user_id} then true
      else 
      false
    end is_mine
  from
    vendor_notes vn
  left join users u on
    u.id = vn.created_by
  where
    vn.vendor_id = ${vendor_id}
    and vn.deleted_by is null
    and vn.deleted_at is null
  order by
    vn.id desc
      offset ${page}
  limit ${page_size}
  `);
    const count_all = await this.connection.query(`select
	count(*) as count_data
from
	(
	select
		vn.id,
		vn.vendor_id,
		vn.notes as note,
		vn.created_at,
		u.full_name as owner_name
	from
		vendor_notes vn
	left join users u on
		u.id = vn.created_by
	where
		vn.vendor_id = ${vendor_id}
		and vn.deleted_by is null
		and vn.deleted_at is null
	order by
		vn.created_at desc
      ) as raw
`);
    const total_data = count_all[0] ? parseInt(count_all[0].count_data) : 0;
    return {
      results,
      total_data,
    };
  }

  async remove(vendor_id, note_id, user_id) {
    const vendor = await this.vendorNotesRepository.findOne({
      where: {
        vendor_id,
        id: note_id,
        created_by: user_id,
      },
      select: { id: true, deleted_at: true, deleted_by: true },
    });
    if (!vendor) {
      throw new AppErrorNotFoundException('Not Found');
    }
    try {
      vendor.deleted_at = new Date().toISOString();
      vendor.deleted_by = user_id;
      this.vendorNotesRepository.save(vendor);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
