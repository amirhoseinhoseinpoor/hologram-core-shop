import { Inject, Injectable, Scope , NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { Role } from 'src/core/db/entities/roles.entity';
import { UserRole } from 'src/core/db/entities/user-roles.entity';
import { Permission } from 'src/core/db/entities/permission.entity';
import { RolesPermission } from 'src/core/db/entities/roles-permission.entity';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class RolesRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(role: Role) {
    return await this.getRepository(Role).save(this.By(role));
  }

  async findBy(where: {}) {
    return await this.find(Role, where);
  }

  async remove(id: number) {
    // Remove related entries in the UserRoles table
    await this.getRepository(UserRole).delete({ role: { id: id } });

    // Remove related entries in the RolesPermission table
    await this.getRepository(RolesPermission).delete({ role: { id: id } });

    // Remove the role
    return await this.getRepository(Role).delete(id);
  }

  async findAll() {
    return await this.getRepository(Role).find({ 
      relations: ['permissions', 'permissions.permission'],
    });
  }

  async updateRolePermissions(roleId: number, permissionIds: number[]) {
    const role = await this.getRepository(Role).findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

   // Remove existing permissions
   await this.getRepository(RolesPermission).delete({ role: { id: roleId } });

   // Add new permissions
   const permissions = await this.getRepository(Permission).findByIds(permissionIds);
   const rolesPermissions = permissions.map(permission => {
     const rolesPermission = new RolesPermission();
     rolesPermission.role = role;
     rolesPermission.permission = permission;
     return rolesPermission;
   });

   await this.getRepository(RolesPermission).save(rolesPermissions);

   return await this.getRepository(Role).findOne({
     where: { id: roleId },
     relations: ['permissions'],
   });
 }
}
