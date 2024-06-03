import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRolesRepository } from './user-roles.repository';
import { UserRole } from 'src/core/db/entities/user-roles.entity';
import { RolesService } from '../roles/roles.service';
import { In } from 'typeorm';

@Injectable()
export class UserRolesService {
  constructor(
    private repo: UserRolesRepository,
    private rolesService: RolesService,
  ) {}

  async exists(ids: number[]) {
    if (!ids?.length) 
      return true;
    const roles = await this.rolesService.findBy({ id: In(ids) });
    if (roles?.length != ids?.length)
      throw new BadRequestException('Invalid selected roles, Check them');
    return true;
  }

  asUserRoles(userId: number, ids: number[]): UserRole[] {
    return ids.map((i) => {
      return { role: { id: i }, user: { id: userId } } as UserRole;
    });
  }

  async create(userId: number, ids: number[]) {
    return await this.repo.createOrUpdate(this.asUserRoles(userId, ids));
  }

  async update(userId: number, oldUserRoles: UserRole[], ids: number[]) {
    if (ids?.length > 0) 
      await this.remove(oldUserRoles);
    return await this.create(userId, ids);
  }

  async remove(userRoles: UserRole[]) {
    return await this.repo.remove(userRoles);
  }
}
