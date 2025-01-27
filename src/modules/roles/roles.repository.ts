import { Inject, Injectable, Scope , NotFoundException , BadRequestException } from '@nestjs/common';
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

  async createRoleWithPermissions(name: string, permissionIds: number[]) {
    const role = new Role();
    role.name = name;
  
    // First, check if a role with the same name already exists
    const existingRole = await this.getRepository(Role).findOne({ where: { name } });
  
    if (existingRole) {
      // If role already exists, throw a BadRequestException with a meaningful message
      throw new BadRequestException(`Role with name "${name}" already exists.`);
    }
  
    // Now proceed with creating the new role
    const permissions = await this.getRepository(Permission).findByIds(permissionIds);
  
    // Map the permissions to RolesPermission entities
    const rolesPermissions = permissions.map(permission => {
      const rolesPermission = new RolesPermission();
      rolesPermission.role = role;
      rolesPermission.permission = permission;
      return rolesPermission;
    });
  
    // Save the role first
    const savedRole = await this.getRepository(Role).save(role);
  
    // Check if the role already has these permissions to avoid duplicates
    const existingPermissions = await this.getRepository(RolesPermission)
      .createQueryBuilder('rolesPermission')
      .innerJoin('rolesPermission.permission', 'permission')
      .where('rolesPermission.roleId = :roleId', { roleId: savedRole.id })
      .andWhere('permission.id IN (:...permissionIds)', { permissionIds })
      .getMany();
  
    // Filter out the permissions that already exist for the role
    const newRolesPermissions = rolesPermissions.filter(rolesPermission => {
      return !existingPermissions.some(existing => 
        existing.permission.id === rolesPermission.permission.id
      );
    });
  
    // Only insert the new permissions that don't already exist
    if (newRolesPermissions.length > 0) {
      await this.getRepository(RolesPermission).save(newRolesPermissions);
    }
  
    // Return the role with the permissions that have been successfully assigned
    return await this.getRepository(Role).findOne({
      where: { id: savedRole.id },
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
