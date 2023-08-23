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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorsEntity,
      UsersRolesEntity,
      VendorNotesEntity,
    ]),
  ],
  controllers: [VendorsController, VendorsNoteController],
  providers: [VendorsService, RolesPermissionGuard, VendorsNoteService],
})
export class VendorsModule {}
