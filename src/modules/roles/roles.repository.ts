import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { Role } from 'src/core/db/entities/roles.entity';
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
    return await this.getRepository(Role).delete(id);
  }
}
