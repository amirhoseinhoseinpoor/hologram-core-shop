import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesRepository } from './roles.repository';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/core/db/entities/roles.entity';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { ILike } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
     private repo: RolesRepository,
     private dataSource: DataSource
    ) {}

  asRole(dto: CreateRoleDto | UpdateRoleDto): Role {
    return { ...dto } as Role;
  }

  async create(dto: CreateRoleDto) {
    const currRole = await this.findBy({ name: ILike(dto.name) });
    if (currRole?.length) throw new BadRequestException('Role exists.');
    return this.repo.createOrUpdate(this.asRole(dto));
  }

  async findBy(where: {}) {
    return await this.repo.findBy(where);
  }

  async findAllWithPermissions() {
    const roles = await this.repo.findAll();
    return roles.map(role => ({
      ...role,
      permissions: role.permissions,
    }));
  }

  async update(id: number, dto: UpdateRoleDto) {
    const currRole = await this.findBy({ name: ILike(dto.name) });
    if (!currRole?.length)
      throw new BadRequestException('Role does not exist.');
    const role = this.asRole(dto);
    role.id = id;
    return this.repo.createOrUpdate(role);
  }

  async updateRolePermissions(dto: UpdateRolePermissionsDto) {
    const { roleId, permissionIds } = dto;
    return await this.repo.updateRolePermissions(roleId, permissionIds);
  }

  async remove(id: number) {
    const currRole = await this.findBy({ id: id });
    if (!currRole?.length)
      throw new BadRequestException('Role does not exist.');
    return await this.repo.remove(id);
  }
}
