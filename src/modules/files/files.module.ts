import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';
import { FilesEntity } from '../../entities/master/files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
