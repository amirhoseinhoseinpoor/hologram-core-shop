import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { Order } from 'src/core/db/entities/order.entity';
import { USER_INFO_KEY } from 'src/core/misc/consts';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class OrderRepository extends BaseRepository {
  constructor(
    dataSource: DataSource,
    @Inject(REQUEST) private req: Request,
  ) {
    super(dataSource, req);
  }

  async createOrUpdate(order: Order) {
    return await this.getRepository(Order).save(this.By(order));
  }

  
  async findAllQuery(filters: any) {
    const { status, sortBy = 'createdAt', sortOrder = 'ASC' } = filters;
  
    const queryBuilder = this.getRepository(Order).createQueryBuilder('order');
  
    if (status !== undefined) {
      queryBuilder.andWhere('"order"."status" = :status', { status });
    }
  
    // Apply sorting
    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`"order"."${sortBy}"`, sortOrder.toUpperCase());
    }
  
    return await queryBuilder.getMany();
  }

  async countOrder(filters: any): Promise<number> {
    const { status } = filters;

    const queryBuilder = this.getRepository(Order).createQueryBuilder('order');

    if (status !== undefined) {
      queryBuilder.andWhere('"order"."status" = :status', { status });
    }

    // اضافه کردن شرط deleted = false
    queryBuilder.andWhere('"order"."deleted" = :deleted', { deleted: false });

    return await queryBuilder.getCount();
  }

  async findAll(where?: {}) {
    return await this.find(Order, { ...where, deleted: false });
  }

  async findOne(where: {}) {
    let orders = await this.findAll(where);
    return orders?.length === 1 ? orders[0] : null;
  }

  async findById() {
    const userInfo = this.req[USER_INFO_KEY];

    if (!userInfo || !userInfo.id) {
      throw new BadRequestException('User ID not found in token');
    }

    const orders = await this.getRepository(Order).find({
      where: { createdBy: userInfo.id },
    });

    if (!orders || orders.length === 0) {
      return null;
    }

    return orders;
  }
}
