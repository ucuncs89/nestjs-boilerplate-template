import {
  Body,
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
import { VendorsExcelService } from '../services/vendors-excel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { excelFileFilter } from 'src/utils/file-upload';

@ApiBearerAuth()
@ApiTags('vendors')
// @UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsExcelController {
  constructor(private readonly vendorsExcelService: VendorsExcelService) {}

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
  ) {
    const data = await this.vendorsExcelService.createVendorExcel({
      //   user_id: req.user.id,
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
