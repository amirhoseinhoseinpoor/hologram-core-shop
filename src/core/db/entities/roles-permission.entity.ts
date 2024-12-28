import { Entity, ManyToOne } from "typeorm";
import { BaseRetailEntity } from "./base-retail.entity";
import { Role } from "./roles.entity";
import { Permission } from "./permission.entity";

@Entity('RolesPermission')
export class RolesPermission extends BaseRetailEntity {
  @ManyToOne(() => Permission, per => per.permissions, { nullable: true })
  permission: Permission;

  @ManyToOne(() => Role, role => role.permissions, { nullable: true })
  role: Role;
}