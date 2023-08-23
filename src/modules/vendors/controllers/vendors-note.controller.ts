import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Pagination } from '../../../utils/pagination';
import { I18n, I18nContext } from 'nestjs-i18n';

import { VendorsNoteService } from '../services/vendors-note.service';
import { CreateVendorNoteDto } from '../dto/create-vendor-note.dto';
import { GetListVendorsNoteDto } from '../dto/get-list-vendor-note.dto';

@ApiBearerAuth()
@ApiTags('vendors note')
@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsNoteController {
  constructor(private readonly vendorsNoteService: VendorsNoteService) {}

  @Post(':vendor_id/note')
  async create(
    @Req() req,
    @Param('vendor_id') vendor_id: number,
    @Body() createVendorNoteDto: CreateVendorNoteDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.vendorsNoteService.create(
      createVendorNoteDto,
      vendor_id,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get(':vendor_id/note')
  async findAll(
    @Req() req,
    @Param('vendor_id') vendor_id: number,
    @Query() query: GetListVendorsNoteDto,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.vendorsNoteService.findAll({
      vendor_id,
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      user_id: req.user.id,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/vendors/${vendor_id}/note`,
    );
    return { message: 'Successfully', data, pagination };
  }

  @Delete(':vendor_id/note/:note_id')
  async remove(
    @Req() req,
    @Param('vendor_id') vendor_id: number,
    @Param('note_id') note_id: number,
  ) {
    const data = await this.vendorsNoteService.remove(
      vendor_id,
      note_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
}
