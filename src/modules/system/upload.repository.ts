import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/core/db/entities/user.entity';
import { Upload } from 'src/core/db/entities/upload.entity';

@Injectable({ scope: Scope.REQUEST })
export class UploadRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(upload: Upload[]) {
    return await this.getRepository(Upload).save(this.By(upload));
  }

  async findAll(where?: {}) {
    return await this.find(Upload, { ...where, active: true });
  }

}
