import { Inject , Injectable , Scope } from "@nestjs/common";
import { REQUEST } from '@nestjs/core';
import { Request } from "express";
import { BaseRepository } from "src/core/db/base.repository";
import { DataSource } from "typeorm";
import { Header } from "src/core/db/entities/header.entity";

@Injectable({ scope: Scope.REQUEST })
export class HeaderRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(header: Header) {
    return await this.getRepository(Header).save(this.By(header));
  }

  async findAll(where?: {}) {
    return await this.find(Header, { ...where });
  }

  async findOne(where: {}) {
    const header = await this.findAll(where);
    return header?.length === 1 ? header[0] : null;
  }

}