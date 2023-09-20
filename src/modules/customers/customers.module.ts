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
import { CustomersExcelService } from './services/customers-excel.service';
import { ProvinceEntity } from 'src/entities/master/province.entity';
import { CityEntity } from 'src/entities/master/city.entity';
import { CityService } from '../region/services/city.service';
import { ProvinceService } from '../region/services/province.service';
import { CustomersExcelController } from './controllers/customers-excel.controller';
import { RabbitMQModule } from 'src/rabbitmq/rabbit-mq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomersEntity,
      UsersRolesEntity,
      CustomerNotesEntity,
      ProvinceEntity,
      CityEntity,
    ]),
    RabbitMQModule,
  ],
  controllers: [
    CustomersController,
    CustomersNoteController,
    CustomersExcelController,
  ],
  providers: [
    CustomersService,
    RolesPermissionGuard,
    CustomersNoteService,
    CustomersExcelService,
    CityService,
    ProvinceService,
  ],
})
export class CustomersModule {}
