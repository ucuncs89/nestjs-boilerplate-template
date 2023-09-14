import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { excelFileFilter } from 'src/utils/file-upload';
import { CategoryExcelService } from '../services/category-excel.service';

@ApiBearerAuth()
@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryExcelController {
  constructor(private readonly categoryExcelService: CategoryExcelService) {}

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
  async uploadedFileExcel(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.categoryExcelService.createCategoryExcel(
      {
        ...file,
        mimetype: file.mimetype,
        file_buffer: file.buffer,
      },
      req.user.id,
      i18n,
    );
    return {
      message: 'Successfully upload file',
      data,
    };
  }
}
