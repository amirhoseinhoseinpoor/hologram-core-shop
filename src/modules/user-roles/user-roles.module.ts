import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { RolesModule } from '../roles/roles.module';
import { UserRolesRepository } from './user-roles.repository';

@Module({
  imports: [RolesModule],
  controllers: [],
  providers: [UserRolesService, UserRolesRepository],
  exports: [UserRolesService]
})
export class UserRolesModule {}