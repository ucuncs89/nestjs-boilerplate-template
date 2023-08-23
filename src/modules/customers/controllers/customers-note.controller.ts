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
import { CustomersNoteService } from '../services/customers-note.service';
import { CreateCustomerNoteDto } from '../dto/create-customer-note.dto';
import { GetListCustomersNoteDto } from '../dto/get-list-customer-note.dto';

@ApiBearerAuth()
@ApiTags('customers note')
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersNoteController {
  constructor(private readonly customersNoteService: CustomersNoteService) {}

  @Post(':customer_id/note')
  async create(
    @Req() req,
    @Param('customer_id') customer_id: number,
    @Body() createCustomerNoteDto: CreateCustomerNoteDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.customersNoteService.create(
      createCustomerNoteDto,
      customer_id,
      req.user.id,
      i18n,
    );
    return { data };
  }

  @Get(':customer_id/note')
  async findAll(
    @Req() req,
    @Param('customer_id') customer_id: number,
    @Query() query: GetListCustomersNoteDto,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.customersNoteService.findAll({
      customer_id,
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      user_id: req.user.id,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/customers/${customer_id}/note`,
    );
    return { message: 'Successfully', data, pagination };
  }

  @Delete(':customer_id/note/:note_id')
  async remove(
    @Req() req,
    @Param('customer_id') customer_id: number,
    @Param('note_id') note_id: number,
  ) {
    const data = await this.customersNoteService.remove(
      customer_id,
      note_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
}
