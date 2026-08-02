import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { OtpCode } from 'src/core/db/entities/otp-codes.entity';
import { LessThan } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class OtpRepository extends BaseRepository {
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) req: Request,
  ) {
    super(dataSource, req);
  }

  async createOrUpdate(otp: OtpCode): Promise<OtpCode> {
    return await this.getRepository(OtpCode).save(this.By(otp));
  }

  async findOne(where?: Partial<OtpCode>): Promise<OtpCode | null> {
    return await this.getRepository(OtpCode).findOne({
      where,
    });
  }

  async deleteExpired() {
    return await this.getRepository(OtpCode).delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async delete(where?: Partial<OtpCode>) {
    return await this.getRepository(OtpCode).delete(where);
  }
}