import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from '../../../exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesEntity } from '../../../entities/master/files.entity';
import { Storage } from '@google-cloud/storage';
import { StorageConfig } from 'src/config/google-storage.config';
import { parse } from 'path';

@Injectable()
export class FilesService {
  private storage: Storage;
  private bucket: string;

  constructor(
    @InjectRepository(FilesEntity)
    private filesRepository: Repository<FilesEntity>,
  ) {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }
  async createUpload(payload) {
    const { user_id, mimetype, base_url, size, originalname } = payload;
    try {
      const destination = `media`;

      const fileName =
        this.setDestination(destination) + this.setFilename(payload);
      const file = this.storage.bucket(this.bucket).file(fileName);
      await file.save(payload.buffer, {
        contentType: payload.mimetype,
      });
      const data = this.filesRepository.create({
        original_name: originalname,
        mimetype,
        file_name: this.setFilename(payload),
        path: fileName,
        size,
        created_by: user_id,
        base_url,
      });
      await this.filesRepository.save(data);

      return { ...data, file_url: `${process.env.APP_URL_FILE}${fileName}` };
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
