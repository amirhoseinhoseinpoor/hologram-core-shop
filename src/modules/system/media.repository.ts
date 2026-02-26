import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource, Like } from 'typeorm';
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

  // Finds a single active file by fileName regardless of public/private status.
  // Tries exact match first; falls back to LIKE 'uuid.%' to handle legacy
  // references that were stored without a file extension.
  async findByFileName(fileName: string): Promise<Media | null> {
    const exact = await this.find(Media, { fileName, active: true });
    if (exact?.length > 0) return exact[0];

    const fuzzy = await this.getRepository(Media).find({
      where: { fileName: Like(`${fileName}.%`), active: true },
    });
    return fuzzy?.length > 0 ? fuzzy[0] : null;
  }

  // Like findOne() but resolves UUID-only filenames (legacy) to their UUID.ext
  // counterpart in the DB, preserving the isPublic + createdBy access checks.
  async findOneFlexible(isPublic: boolean, rawFileName: string): Promise<Media | null> {
    const base: any = { active: true, isPublic };
    if (!isPublic) base.createdBy = this.getUserInfo().id;

    // 1. Exact match (new uploads that already have an extension)
    const exact = await this.find(Media, { ...base, fileName: rawFileName });
    if (exact?.length > 0) return exact[0];

    // 2. LIKE fallback: 'uuid' → matches 'uuid.png', 'uuid.mp4', etc.
    const fuzzy = await this.getRepository(Media).find({
      where: { ...base, fileName: Like(`${rawFileName}.%`) },
    });
    return fuzzy?.length > 0 ? fuzzy[0] : null;
  }
}
