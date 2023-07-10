import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesEntity } from 'src/entities/master/files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private filesRepository: Repository<FilesEntity>,
  ) {}
  async createUpload(payload) {
    const { user_id, filename, originalname, mimetype, path, size, base_url } =
      payload;
    let data = {};
    try {
      const fileBuffer = fs.readFileSync(`files/${filename}`);
      const hashSum = crypto.createHash('sha1');
      hashSum.update(fileBuffer);
      const hash = hashSum.digest('hex');
      data = this.filesRepository.create({
        original_name: originalname,
        mimetype,
        file_name: filename,
        path,
        size,
        created_by: user_id,
        hash,
        base_url,
      });
      await this.filesRepository.save(data);
      return data;
    } catch (e) {
      throw new AppErrorException(e.message);
    }
  }
  async findFileById(id: number) {
    return await this.filesRepository.findOne({ where: { id } });
  }

  async deletedById(id, user_id) {
    const file = await this.findFileById(id);
    if (!file) {
      throw new AppErrorNotFoundException();
    }
    if (file.created_by !== user_id) {
      throw new AppErrorException('This File not Owners');
    }
    try {
      fs.unlinkSync(`${file.path}`);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async deleteFileByFileName(file_name, user_id) {
    const file = await this.filesRepository.findOne({
      where: {
        file_name,
      },
    });
    if (!file) {
      throw new AppErrorNotFoundException();
    }
    if (file.created_by !== user_id) {
      throw new AppErrorException('This File not Owners');
    }
    try {
      fs.unlinkSync(`${file.path}`);
      return true;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
