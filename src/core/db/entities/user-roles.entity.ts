import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Role } from './roles.entity';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('UserRoles')
export class UserRole extends BaseRetailEntity {
  @ManyToOne(() => User, user => user.userRoles, { nullable: true })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { nullable: true })
  role: Role;
}
