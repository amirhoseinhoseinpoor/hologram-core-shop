import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/core/db/entities/user.entity';
import { Media } from 'src/core/db/entities/media.entity';

@Injectable({ scope: Scope.REQUEST })
export class MediaRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(media: Media[]) {
    return await this.getRepository(Media).save(this.By(media));
  }

  async findAll(isPublic: boolean, where?: {}) {
    let extra: any = { isPublic: isPublic };
    if (!isPublic) extra = { ...extra, createdBy: this.getUserInfo().id };
    return await this.find(Media, { ...where, active: true, ...extra });
  }

  async findOne(isPublic: boolean, where?: {}) {
    const files = await this.findAll(isPublic, where);
    return files?.length === 1 ? files[0] : null;
  }
}
