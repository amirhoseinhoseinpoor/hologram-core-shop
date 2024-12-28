import { Entity, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { BaseRetailEntity } from './base-retail.entity';
import { RolesPermission } from './roles-permission.entity';

@Entity('Roles')
export class Role extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @OneToMany(() => RolesPermission, per => per.role)
  permissions: RolesPermission[];

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];
}