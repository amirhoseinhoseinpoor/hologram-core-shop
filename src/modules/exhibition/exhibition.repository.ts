import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Exhibition } from 'src/core/db/entities/exhibition.entity';

@Injectable({ scope: Scope.REQUEST })
export class ExhibitionRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(exhibition: Exhibition) {
    return await this.getRepository(Exhibition).save(this.By(exhibition));
  }

  async findAll(where?: {}) {
    return await this.find(Exhibition, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    const products = await this.findAll(where);
    return products?.length === 1 ? products[0] : null;
  }
}
