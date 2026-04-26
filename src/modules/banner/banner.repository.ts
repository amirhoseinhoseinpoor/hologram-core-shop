import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Banner } from 'src/core/db/entities/banner.entity';

@Injectable({ scope: Scope.REQUEST })
export class BannerRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(banner: Banner) {
    return await this.getRepository(Banner).save(this.By(banner));
  }

  async findAll(where?: {}) {
    return await this.find(Banner, { ...where, deleted: false });
  }

  // In your banner.repository.ts
  async findOne(where: {}, includeDeleted: boolean = false) {

    const queryBuilder = this.getRepository(Banner).createQueryBuilder('banner');

    // Add where conditions
    Object.keys(where).forEach(key => {
      queryBuilder.andWhere(`banner.${key} = :${key}`, { [key]: where[key] });
    });

    // Only filter deleted if includeDeleted is false
    if (!includeDeleted) {
      queryBuilder.andWhere('banner.deleted = :deleted', { deleted: false });
    }

    const result = await queryBuilder.getOne();

    return result;
  }
}
