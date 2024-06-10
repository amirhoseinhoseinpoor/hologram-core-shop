import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { UserRole } from 'src/core/db/entities/user-roles.entity';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserRolesRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(userRoles: UserRole[]) {
    return await this.getRepository(UserRole).save(this.By(userRoles));
  }

  async remove(userRoles: UserRole[]) {
    return await this.getRepository(UserRole).remove(userRoles);
  }

  async delete(userRoles: UserRole[]) {
    return userRoles.map(async (ur) => {
      return await this.getRepository(UserRole).delete({ id: ur.id });
    });
  }
}
