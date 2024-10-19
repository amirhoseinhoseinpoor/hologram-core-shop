import { Inject , Injectable , Scope } from "@nestjs/common";
import { REQUEST } from '@nestjs/core';
import { Request } from "express";
import { BaseRepository } from "src/core/db/base.repository";
import { DataSource } from "typeorm";
import { Banner } from "src/core/db/entities/banner.entity";

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

  async findOne(where: {}) {
    const banner = await this.findAll(where);
    return banner?.length === 1 ? banner[0] : null;
  }
}