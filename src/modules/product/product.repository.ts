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
    const queryBuilder =
      this.getRepository(Product).createQueryBuilder('product');

    queryBuilder.andWhere('"product"."deleted" = :deleted', { deleted: false });

    queryBuilder.orderBy(`product.createdAt`, 'ASC');

    return await queryBuilder.getMany();
  }

  // async findOne(where: {}) {
  //   const products = await this.findAll(where);
  //   return products?.length === 1 ? products[0] : null;
  // }

  // In your product.repository.ts
  async findOne(code: string, includeDeleted: boolean = false): Promise<Product | null> {
    const repo = this.getRepository(Product);
    return await repo.findOne({
      where: includeDeleted ? { code } : { code, deleted: false }
    });
  }

  async findAndCount(options?: any) {
    return await this.getRepository(Product).findAndCount(options);
  }

  async countNonDeleted() {
    return await this.getRepository(Product).count({
      where: { deleted: false },
    });
  }
}
