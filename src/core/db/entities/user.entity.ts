import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Users')
export class User extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 15, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  nId: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lastName: string;

  /**
   * m - male
   * f - female
   * u - unspecified
   */
  @Column({ type: 'enum', enum: ['m', 'f', 'u'], nullable: true, default: 'u' })
  gender: string = 'u';

  @Column({ type: 'varchar', length: 40, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;

  @Column({ type: 'boolean', default: false })
  active: boolean = false;

  @OneToMany(() => UserRole, (ur) => ur.user, { eager: true })
  userRoles?: UserRole[];
}
