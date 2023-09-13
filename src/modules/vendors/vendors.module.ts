import { Module } from '@nestjs/common';
import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsEntity } from '../../entities/vendors/vendors.entity';
import { RolesPermissionGuard } from '../roles/roles-permission';
import { UsersRolesEntity } from '../../entities/users/users_roles.entity';
import { VendorsNoteController } from './controllers/vendors-note.controller';
import { VendorsNoteService } from './services/vendors-note.service';
import { VendorNotesEntity } from 'src/entities/vendors/vendor_notes.entity';
import { VendorsExcelController } from './controllers/vendors-excel.controller';
import { VendorsExcelService } from './services/vendors-excel.service';
import { ProvinceService } from '../region/services/province.service';
import { CityService } from '../region/services/city.service';
import { ProvinceEntity } from 'src/entities/master/province.entity';
import { CityEntity } from 'src/entities/master/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorsEntity,
      UsersRolesEntity,
      VendorNotesEntity,
      ProvinceEntity,
      CityEntity,
    ]),
  ],
  controllers: [
    VendorsController,
    VendorsNoteController,
    VendorsExcelController,
  ],
  providers: [
    VendorsService,
    RolesPermissionGuard,
    VendorsNoteService,
    VendorsExcelService,
    ProvinceService,
    CityService,
  ],
})
export class VendorsModule {}
