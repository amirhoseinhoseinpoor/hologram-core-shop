import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesPermissionRepository } from './roles-permission.repository';
import { RolesPermission } from 'src/core/db/entities/roles-permission.entity';
import { PermissionService } from './../permission/permission.service';
import { In } from 'typeorm';

@Injectable()
export class RolesPermissionService {
  constructor(
    private repo: RolesPermissionRepository,
    private permissionService: PermissionService,
  ) {}

  async exists(roleIds: number[]) {
    if (!roleIds?.length) return true;
    const roles = await this.permissionService.findBy({ id: In(roleIds) });
    if (roles?.length != roleIds?.length)
      throw new BadRequestException('Invalid selected roles, Check them');
    return true;
  }

  asUserRoles(permissionId: number, roleIds: number[]): RolesPermission[] {
    if (!Array.isArray(roleIds)) return [];
    return roleIds.map((i) => {
      return { permission: { id: i }, role: { id: permissionId } } as RolesPermission;
    });
  }

  async create(userId: number, roleIds: number[]) {
    if (Array.isArray(roleIds) && roleIds.length)
      return await this.repo.createOrUpdate(this.asUserRoles(userId, roleIds));
  }

  async update(userId: number, oldUserRoles: RolesPermission[], roleIds: number[]) {
    await this.delete(oldUserRoles);
    return await this.create(userId, roleIds);
  }

  async remove(userRoles: RolesPermission[]) {
    return await this.repo.remove(userRoles);
  }

  async delete(userRoles: RolesPermission[]) {
    return await this.repo.delete(userRoles);
  }
}
