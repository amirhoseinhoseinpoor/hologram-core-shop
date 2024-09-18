import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Roles')
export class Role extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @OneToMany(() => UserRole, (ur) => ur.role, { nullable: true })
  userRoles?: UserRole[];
}
