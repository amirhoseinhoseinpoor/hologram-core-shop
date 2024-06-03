import { BadRequestException, Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserRolesService } from '../user-roles/user-roles.service';
import { User } from 'src/core/db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { OK, getUID6, ok } from 'src/core/misc/consts';

@Injectable()
export class UsersService {
  constructor(
    private repo: UsersRepository,
    private userRoleService: UserRolesService,
  ) {}

  async asUser(dto: CreateUserDto | UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.active = true;
    Object.assign(user, dto);
    if (dto.password) 
      user.password = await bcrypt.hash(dto.password, 12);
    user.userRoles = this.userRoleService.asUserRoles(0, dto.roleIds);
    return { ...user } as User;
  }

  async create(dto: CreateUserDto) {
    const oldUser = await this.findOneByUsername(dto.username);
    if (oldUser?.username) 
      throw new BadRequestException('Username exists.');
    await this.userRoleService.exists(dto.roleIds);
    const newUser = await this.asUser(dto);
    newUser.code = getUID6('U');
    return await this.repo.createOrUpdate(newUser);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.userRoleService.exists(dto.roleIds);
    let curUser = await this.repo.findOne({ id: id });
    if (!curUser) 
      throw new BadRequestException('User does not found');
    Object.assign(curUser, await this.asUser(dto));
    return await this.repo.createOrUpdate(curUser);
  }

  async findOneByUsername(username: string) {
    return await this.repo.findOne({ username: username });
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ id: id });
  }

  async remove(id: number) {
    const curUser = await this.repo.findOne({ id: id });
    if (!curUser) 
      throw new BadRequestException('User does not found');
    curUser.deleted = true;
    return await this.repo.createOrUpdate(curUser);
  }
}
