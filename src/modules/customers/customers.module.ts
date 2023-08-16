import { Module } from '@nestjs/common';
import { CustomersController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '../../entities/customers/customers.entity';
import { RolesPermissionGuard } from '../roles/roles-permission';
import { UsersRolesEntity } from '../../entities/users/users_roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity, UsersRolesEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, RolesPermissionGuard],
})
export class CustomersModule {}
