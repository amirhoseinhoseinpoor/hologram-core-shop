import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { BaseRetailEntity } from './base-retail.entity';
import { Permission } from './permission.entity';

@Entity('Roles')
export class Role extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];
}