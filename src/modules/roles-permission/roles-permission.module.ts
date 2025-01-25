import { Module } from '@nestjs/common';
import { RolesPermissionService } from './roles-permission.service';
import { RolesPermissionRepository } from './roles-permission.repository';
import { PermissionModule } from './../permission/permission.module';


@Module({
  imports: [PermissionModule],
  controllers: [],
  providers: [RolesPermissionService, RolesPermissionRepository],
  exports: [RolesPermissionService],
})
export class RolesPermissionModule {}
