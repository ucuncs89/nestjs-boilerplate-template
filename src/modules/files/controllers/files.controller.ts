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
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import 'dotenv/config';
import { JwtAuthGuard } from '../../../modules/auth/jwt-auth.guard';
import { FilesService } from '../services/files.service';
import { imageFileFilter } from '../../../utils/file-upload';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 8000000, // Compliant: 8MB
      },
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
  async uploadedFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const data = await this.filesService.createUpload({
      user_id: 1,
      ...file,
      mimetype: file.mimetype,
      file_buffer: file.buffer,
      base_url: process.env.APP_URL_FILE,
    });
    return {
      message: 'Successfully upload file',
      data,
    };
  }

  @Get(':imgpath')
  async seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':filename')
  async deleteByFilename(@Request() req, @Param('filename') filename: string) {
    const data = await this.filesService.deleteFileByFileName(
      filename,
      req.user.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Request() req, @Param('id') id: number) {
    const data = await this.filesService.deletedById(id, req.user.id);
    return { data };
  }
}
