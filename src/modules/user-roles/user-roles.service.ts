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

  async exists(roleIds: number[]) {
    if (!roleIds?.length) return true;
    const roles = await this.rolesService.findBy({ id: In(roleIds) });
    if (roles?.length != roleIds?.length)
      throw new BadRequestException('Invalid selected roles, Check them');
    return true;
  }

  asUserRoles(userId: number, roleIds: number[]): UserRole[] {
    if (!Array.isArray(roleIds)) return [];
    return roleIds.map((i) => {
      return { role: { id: i }, user: { id: userId } } as UserRole;
    });
  }

  async create(userId: number, roleIds: number[]) {
    if (Array.isArray(roleIds) && roleIds.length)
      return await this.repo.createOrUpdate(this.asUserRoles(userId, roleIds));
  }

  async update(userId: number, oldUserRoles: UserRole[], roleIds: number[]) {
    await this.delete(oldUserRoles);
    return await this.create(userId, roleIds);
  }

  async remove(userRoles: UserRole[]) {
    return await this.repo.remove(userRoles);
  }

  async delete(userRoles: UserRole[]) {
    return await this.repo.delete(userRoles);
  }
}
