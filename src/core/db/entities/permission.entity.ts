import { Entity, Column, OneToMany } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';
import { RolesPermission } from './roles-permission.entity';

@Entity('Permission')
export class Permission extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true , default: '' })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true , default: '' })
  htmlId: string;

  @OneToMany(() => RolesPermission, role => role.permission)
  permissions: RolesPermission[];
}