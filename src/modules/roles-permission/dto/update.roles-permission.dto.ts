import { RolesPermission } from './../../../core/db/entities/roles-permission.entity';
import { PartialType } from "@nestjs/swagger";

export class UpdateRolesPermissionDto extends PartialType(RolesPermission) {}