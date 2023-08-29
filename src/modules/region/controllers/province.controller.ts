import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { ProvinceService } from '../services/province.service';
import { CreateProvinceDto } from '../dto/create-province.dto';
import { GetListProvinceDto } from '../dto/get-list-province.dto';
import { UpdateProvinceDto } from '../dto/update-province.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { excelFileFilter } from 'src/utils/file-upload';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createProvinceDto: CreateProvinceDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.provinceService.create(
      createProvinceDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListProvinceDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.provinceService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      keyword: query.keyword,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/province`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.provinceService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.provinceService.update(
      +id,
      updateProvinceDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.provinceService.remove(+id, req.user.id, i18n);
    return { message: 'Successfully', data };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 8000000, // Compliant: 8MB
      },
      fileFilter: excelFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const data = await this.provinceService.importExcel({
      user_id: req.user.id,
      ...file,
      mimetype: file.mimetype,
      file_buffer: file.buffer,
    });
    return {
      message: 'Successfully upload file',
      data,
    };
  }
}
