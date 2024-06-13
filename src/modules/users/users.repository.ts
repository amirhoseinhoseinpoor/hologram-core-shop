import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/core/db/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(user: User) {
    return await this.getRepository(User).save(this.By(user));
  }

  async findAll(where: {}, relations?: {}) {
    return await this.find(User, { ...where, deleted: false }, relations);
  }

  async findOne(where: {}, relations?: {}) {
    let users = await this.findAll({ ...where, deleted: false }, relations);
    return users?.length === 1 ? users[0] : null;
  }
}
