import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/db/base.repository';
import { DataSource , SelectQueryBuilder } from 'typeorm';
import { User } from 'src/core/db/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createOrUpdate(user: User): Promise<User> {
    return await this.getRepository(User).save(this.By(user));
  }

  async findAll(
    where?: Partial<User>,
    relations?: string[],
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<User[]> {

    const userRepo = this.getRepository(User);
    let queryBuilder: SelectQueryBuilder<User> = userRepo.createQueryBuilder('user');

    // Apply filters
    if (where) {
      Object.keys(where).forEach((key) => {
        if (where[key] !== undefined && where[key] !== null) {
          queryBuilder = queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: where[key] });
        }
      });
    }

    // Apply sorting
    queryBuilder = queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Apply pagination
    queryBuilder = queryBuilder.skip((page - 1) * limit).take(limit);

    // Apply relations explicitly
    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        if (relation === 'userRoles') {
          queryBuilder = queryBuilder.leftJoinAndSelect('user.userRoles', 'userRoles');
        } else if (relation === 'userRoles.role') {
          queryBuilder = queryBuilder.leftJoinAndSelect('userRoles.role', 'role');
        }
        // Add more relations as needed
      });
    }

    return await queryBuilder.getMany();
  }


  async findOne(where:{}, relations?: {}): Promise<User | null> {
    return await this.getRepository(User).findOne({
      where,
      relations,
    });
  }
}
