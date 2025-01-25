import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { RolesPermission } from 'src/core/db/entities/roles-permission.entity';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class RolesPermissionRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(rolesPermission: RolesPermission[]) {
    return await this.getRepository(RolesPermission).save(this.By(rolesPermission));
  }

  async remove(rolesPermission: RolesPermission[]) {
    return await this.getRepository(RolesPermission).remove(rolesPermission);
  }

  async delete(rolesPermission: RolesPermission[]) {
    if (Array.isArray(rolesPermission))
      return rolesPermission.map(async (ur) => {
        return await this.getRepository(RolesPermission).delete({ id: ur.id });
      });
  }
}
