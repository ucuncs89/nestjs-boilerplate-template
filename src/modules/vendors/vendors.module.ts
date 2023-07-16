import { Module } from '@nestjs/common';
import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorsEntity])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
