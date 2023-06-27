import { Module } from '@nestjs/common';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesService } from './services/profiles.service';
import { ProfilesRolesPermissionController } from './controllers/profiles-roles-permission.controller';
import { ProfileRolesPermissionService } from './services/profiles-roles-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users/users.entity';
import { PermissionsEntity } from 'src/entities/permission/permission.entity';
import { RolesEntity } from 'src/entities/roles/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, PermissionsEntity, RolesEntity]),
  ],
  controllers: [ProfilesController, ProfilesRolesPermissionController],
  providers: [ProfilesService, ProfileRolesPermissionService],
})
export class ProfilesModule {}
