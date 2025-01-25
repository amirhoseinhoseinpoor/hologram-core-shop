import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { Permission } from 'src/core/db/entities/permission.entity';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class PermissionRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(permission: Permission) {
    return await this.getRepository(Permission).save(this.By(permission));
  }

  async findBy(where: {}) {
    return await this.find(Permission, where);
  }

  async remove(id: number) {
    return await this.getRepository(Permission).delete(id);
  }
}
