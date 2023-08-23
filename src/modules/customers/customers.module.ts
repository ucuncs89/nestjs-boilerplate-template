import { Module } from '@nestjs/common';
import { CustomersController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '../../entities/customers/customers.entity';
import { RolesPermissionGuard } from '../roles/roles-permission';
import { UsersRolesEntity } from '../../entities/users/users_roles.entity';
import { CustomerNotesEntity } from 'src/entities/customers/customer_notes.entity';
import { CustomersNoteController } from './controllers/customers-note.controller';
import { CustomersNoteService } from './services/customers-note.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomersEntity,
      UsersRolesEntity,
      CustomerNotesEntity,
    ]),
  ],
  controllers: [CustomersController, CustomersNoteController],
  providers: [CustomersService, RolesPermissionGuard, CustomersNoteService],
})
export class CustomersModule {}
