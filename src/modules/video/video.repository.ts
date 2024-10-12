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

  async findOne(where: {}) {
    const products = await this.findAll(where);
    return products?.length === 1 ? products[0] : null;
  }
}
