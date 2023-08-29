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

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { excelFileFilter } from 'src/utils/file-upload';
import { CityService } from '../services/city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { GetListCityDto } from '../dto/get-list-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

@ApiTags('Region')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createCityDto: CreateCityDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.cityService.create(
      createCityDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Get()
  async findAll(@Query() query: GetListCityDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.cityService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      keyword: query.keyword,
      province_id: query.province_id,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/city`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.cityService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.cityService.update(
      +id,
      updateCityDto,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.cityService.remove(+id, req.user.id, i18n);
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
    const data = await this.cityService.importExcel({
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
