import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Contact } from 'src/core/db/entities/contact.entity';

@Injectable({ scope: Scope.REQUEST })
export class ContactRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(contact: Contact) {
    return await this.getRepository(Contact).save(this.By(contact));
  }

  async findAll(where?: {}) {
    return await this.find(Contact, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    const items = await this.findAll(where);
    return items?.length >= 1 ? items[0] : null;
  }

  async countByIpToday(ip: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await this.getRepository(Contact)
      .createQueryBuilder('contact')
      .where('contact.ip = :ip', { ip })
      .andWhere('contact.deleted = :deleted', { deleted: false })
      .andWhere('contact."createdAt" >= :today', { today })
      .getCount();
  }
}
