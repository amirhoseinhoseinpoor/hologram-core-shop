import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Product } from 'src/core/db/entities/product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(product: Product) {
    return await this.getRepository(Product).save(this.By(product));
  }

  async findAll(where?: {}) {
    return await this.find(Product, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    const products = await this.findAll(where);
    return products?.length === 1 ? products[0] : null;
  }

  async countNonDeleted() {
    return await this.getRepository(Product).count({
      where: { deleted: false },
    });
  }
}
