import { Module } from '@nestjs/common';
import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsEntity } from 'src/entities/vendors/vendors.entity';
import { RolesPermissionGuard } from '../roles/roles-permission';
import { UsersRolesEntity } from 'src/entities/users/users_roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorsEntity, UsersRolesEntity])],
  controllers: [VendorsController],
  providers: [VendorsService, RolesPermissionGuard],
})
export class VendorsModule {}
