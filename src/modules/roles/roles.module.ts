import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from '../../entities/roles/roles.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { RolesPermissionGuard } from './roles-permission';
import { UsersRolesEntity } from 'src/entities/users/users_roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity, UsersRolesEntity])],
  controllers: [RolesController],
  providers: [RolesService, RolesPermissionGuard],
})
export class RolesModule {}
