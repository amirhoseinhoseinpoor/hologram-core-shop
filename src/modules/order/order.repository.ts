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
  async findAllQuery(filters: {
    status?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Order[]; total: number }> {
    const {
      status,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
      page = 1,
      limit = 10,
    } = filters;
  
    const queryBuilder = this.getRepository(Order).createQueryBuilder('order');
  
    if (status !== undefined) {
      queryBuilder.andWhere('"order"."status" = :status', { status });
    }
  
    // Update allowedSortFields to include 'firstName' and 'lastName'
    const allowedSortFields = [
      'createdAt',
      'status',
      'code',
      'firstName',
      'lastName',
      // Add other fields as necessary
    ];
  
    if (sortBy && sortOrder) {
      if (!allowedSortFields.includes(sortBy)) {
        throw new Error(`Invalid sortBy field: ${sortBy}`);
      }
  
      const sortDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
      if (sortBy === 'firstName' || sortBy === 'lastName') {
        // // Assuming 'user' is the relation name
        // queryBuilder.leftJoinAndSelect('order.user', 'user');
        // queryBuilder.orderBy(`user.${sortBy}`, sortDirection);
      } else {
        queryBuilder.orderBy(`order.${sortBy}`, sortDirection);
      }
    }
  
    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
  
    // Execute query and get [data, total]
    const [data, total] = await queryBuilder.getManyAndCount();
  
    return { data, total };
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
  
    const orders = await this.getRepository(Order)  
      .createQueryBuilder('order')  
      .where('order.createdBy = :userId', { userId: userInfo.id })  
      .orderBy('order.createdAt', 'DESC')  
      .getMany();  // This will fetch the sorted orders  
  
    if (!orders || orders.length === 0) {  
      return null;  
    }  
  
    return orders;  
  }  
}
