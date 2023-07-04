import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Param,
  UseGuards,
  Request,
  Delete,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import 'dotenv/config';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { FilesService } from '../services/files.service';
import { editFileName, imageFileFilter } from 'src/utils/file-upload';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 8000000, // Compliant: 8MB
      },
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
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
  async uploadedFile(@UploadedFile() file, @Request() req) {
    const data = await this.filesService.createUpload({
      user_id: req.user.id,
      ...file,
      base_url: process.env.APP_URL_FILE,
    });
    return {
      message: 'Successfully upload file',
      data,
      file_url: `${process.env.APP_URL_FILE}${file.filename}`,
    };
  }

  @Get(':imgpath')
  async seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Request() req, @Param('id') id: number) {
    const data = await this.filesService.deletedById(id, req.user.id);
    return { data };
  }
}
