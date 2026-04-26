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


  // In your banner.repository.ts
  async findOne(where: {}, includeDeleted: boolean = false) {

    const queryBuilder = this.getRepository(Honors).createQueryBuilder('honors');

    // Add where conditions
    Object.keys(where).forEach(key => {
      queryBuilder.andWhere(`honors.${key} = :${key}`, { [key]: where[key] });
    });

    // Only filter deleted if includeDeleted is false
    if (!includeDeleted) {
      queryBuilder.andWhere('honors.deleted = :deleted', { deleted: false });
    }

    const result = await queryBuilder.getOne();

    return result;
  }
}
