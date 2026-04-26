import { Request } from 'express';
import { DataSource } from 'typeorm';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { BaseRepository } from 'src/core/db/base.repository';
import { REQUEST } from '@nestjs/core';
import { Video } from 'src/core/db/entities/video.entity';

@Injectable({ scope: Scope.REQUEST })
export class VideoRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(video: Video) {
    return await this.getRepository(Video).save(this.By(video));
  }

  async findAll(where?: {}) {
    return await this.find(Video, { ...where, deleted: false });
  }

  // In your video.repository.ts
  async findOne(where: {}, includeDeleted: boolean = false) {

    const queryBuilder = this.getRepository(Video).createQueryBuilder('video');

    // Add where conditions
    Object.keys(where).forEach(key => {
      queryBuilder.andWhere(`video.${key} = :${key}`, { [key]: where[key] });
    });

    // Only filter deleted if includeDeleted is false
    if (!includeDeleted) {
      queryBuilder.andWhere('video.deleted = :deleted', { deleted: false });
    }

    const result = await queryBuilder.getOne();

    return result;
  }
}
