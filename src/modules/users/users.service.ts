import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserRolesService } from '../user-roles/user-roles.service';
import { User } from 'src/core/db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { OK, genUID, ok } from 'src/core/misc/consts';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private repo: UsersRepository,
    private userRoleService: UserRolesService,
  ) { }

  async asUser(dto: CreateUserDto | UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.active = dto.hasOwnProperty('active') ? dto['active'] : false;
    Object.assign(user, dto);
    if (dto.password) user.password = await bcrypt.hash(dto.password, 12);
    if (dto.roleIds?.length)
      user.userRoles = this.userRoleService.asUserRoles(0, dto.roleIds);
    return { ...user } as User;
  }

  async create(dto: CreateUserDto) {
    const oldUser = await this.findOneByUsername(dto.username);
    if (oldUser?.username) throw new BadRequestException('Username exists.');
    await this.userRoleService.exists(dto.roleIds);
    const newUser = await this.asUser(dto);
    newUser.code = genUID(6, 'U');
    const res = await this.repo.createOrUpdate(newUser);
    await this.userRoleService.create(res.id, dto.roleIds);
    return OK;
  }

  async update(code: string, dto: UpdateUserDto) {
    const curUser = await this.repo.findOne({ code: code });
    if (!curUser) throw new BadRequestException('User not found');

    // Update fields based on the dto  
    if (dto.firstName) curUser.firstName = dto.firstName;
    if (dto.lastName) curUser.lastName = dto.lastName;
    if (dto.username) curUser.username = dto.username;
    if (dto.email) curUser.email = dto.email;
    if (dto.gender) curUser.gender = dto.gender;
    if (dto.domain) curUser.domain = dto.domain;
    if (typeof dto.active !== 'undefined') curUser.active = dto.active; // Check for update on active status  

    // Checking for roleIds to update roles if provided  
    if (Array.isArray(dto.roleIds)) {
      await this.userRoleService.exists(dto.roleIds);
      curUser.userRoles = await this.userRoleService.update(
        curUser.id,
        curUser.userRoles,
        dto.roleIds,
      );
    }

    // Update the user in the repository  
    await this.repo.createOrUpdate(curUser);
    return OK;
  }

  async findOneByUsername(username: string) {
    return await this.repo.findOne({ username: username });
  }

  async findBy(dto: FindUserDto): Promise<User[]> {
    const { page, limit, sortBy, sortOrder, ...filters } = dto;

    // Remove undefined or null properties
    const cleanFilters: Partial<User> = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        cleanFilters[key] = filters[key];
      }
    });

    return await this.repo.findAll(cleanFilters, ['userRoles', 'userRoles.role'], page, limit, sortBy, sortOrder);
  }
  async remove(code: string) {
    const curUser = await this.repo.findOne({ code: code });
    if (!curUser) throw new BadRequestException('User does not found');
    curUser.deleted = true;
    curUser.active = false;
    await this.repo.createOrUpdate(curUser);
    return OK;
  }
}
