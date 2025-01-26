
import { IsArray, IsNumber } from 'class-validator';

export class UpdateRolePermissionsDto {
  @IsNumber()
  roleId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}