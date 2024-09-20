import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource } from 'typeorm';
import { Order } from 'src/core/db/entities/order.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrderRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(order: Order) {
    return await this.getRepository(Order).save(this.By(order));
  }

  async findAll(where?: {}) {
    return await this.find(Order, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    let orders = await this.findAll(where);
    return orders?.length === 1 ? orders[0] : null;
  }

  // async findInfo(where: {}, relations?: {}) {
  //   let order  = await this.findOne({ ...where, deleted: false }, relations);
  //   return order ;
  // }
}