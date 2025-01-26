import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { Provider } from 'src/core/decorator/provider.decorator';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  @Provider()
  findAll() {
    return this.rolesService.findAllWithPermissions();
  }

  @Patch('update-permissions')
  @Provider()
  async updateRolePermissions(@Body() dto: UpdateRolePermissionsDto) {
    return await this.rolesService.updateRolePermissions(dto);
  }

  @Patch(':id')
  @Provider()
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(+id, dto);
  }

  @Delete(':id')
  @Provider()
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
