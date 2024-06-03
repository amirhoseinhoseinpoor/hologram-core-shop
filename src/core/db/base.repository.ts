import { Request } from 'express';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY, USER_INFO_KEY } from '../misc/consts';

export class BaseRepository {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository<T>(klass: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(klass);
  }

  protected queryBuilder() {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.createQueryBuilder();
  }

  protected By<T>(entity: T): T;
  protected By<T>(entities: T[]): T[];
  protected By<T>(arg: T | T[]): T | T[] {
    if (!arg) return null;
    if (Array.isArray(arg))
      return arg.map((m) => {
        return {
          ...m,
          createdBy: this.getUserInfo().id,
        } as T;
      });

    return {
      ...arg,
      createdBy: this.getUserInfo().id,
    } as T;
  }

  protected getUserInfo() {
    return this.request[USER_INFO_KEY] ?? { id: 0 };
  }

  protected async find<T>(entity: new () => T, where: {}, relations?: {}) {
    return await this.getRepository(entity).find({
      where: { ...where },
      relations: relations ?? {},
      // loadEagerRelations: false
    });
  }

}
