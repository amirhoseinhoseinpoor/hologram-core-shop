import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Blogs } from 'src/core/db/entities/blogs.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(blogs: Blogs) {
    return await this.getRepository(Blogs).save(this.By(blogs));
  }

  async findAll(where?: {}) {
    return await this.find(Blogs, { ...where, deleted: false });
  }

  async findAndCount(options?: any) {
    return await this.getRepository(Blogs).findAndCount(options);
  }


  // In your banner.repository.ts
  async findOne(where: {}, includeDeleted: boolean = false) {

    const queryBuilder = this.getRepository(Blogs).createQueryBuilder('blogs');

    // Add where conditions
    Object.keys(where).forEach(key => {
      queryBuilder.andWhere(`blogs.${key} = :${key}`, { [key]: where[key] });
    });

    // Only filter deleted if includeDeleted is false
    if (!includeDeleted) {
      queryBuilder.andWhere('blogs.deleted = :deleted', { deleted: false });
    }

    const result = await queryBuilder.getOne();

    return result;
  }
}
