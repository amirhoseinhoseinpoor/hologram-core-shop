import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionRepository } from './permission.repository';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from 'src/core/db/entities/permission.entity';
import { ILike } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(private repo: PermissionRepository) {}

  asRole(dto: CreatePermissionDto | UpdatePermissionDto): Permission {
    return { ...dto } as Permission;
  }

  async create(dto: CreatePermissionDto) {
    const currPermission = await this.findBy({ name: ILike(dto.name) });
    if (currPermission?.length) throw new BadRequestException('Permission exists.');
    return this.repo.createOrUpdate(this.asRole(dto));
  }

  async findBy(where: {}) {
    return await this.repo.findBy(where);
  }

  async update(id: number, dto: UpdatePermissionDto) {
    const currPermission = await this.findBy({ name: ILike(dto.name) });
    if (!currPermission?.length)
      throw new BadRequestException('Role does not exist.');
    const Permission = this.asRole(dto);
    Permission.id = id;
    return this.repo.createOrUpdate(Permission);
  }

  async remove(id: number) {
    const currPermission = await this.findBy({ id: id });
    if (!currPermission?.length)
      throw new BadRequestException('Role does not exist.');
    return await this.repo.remove(id);
  }
}
