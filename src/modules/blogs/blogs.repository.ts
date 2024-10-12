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

  async findOne(where: {}) {
    const blogs = await this.findAll(where);
    return blogs?.length === 1 ? blogs[0] : null;
  }
}
