import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Honors } from 'src/core/db/entities/honors.entity';

@Injectable({ scope: Scope.REQUEST })
export class HonorsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(honors: Honors) {
    return await this.getRepository(Honors).save(this.By(honors));
  }

  async findAll(where?: {}) {
    return await this.find(Honors, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    const products = await this.findAll(where);
    return products?.length === 1 ? products[0] : null;
  }
}
