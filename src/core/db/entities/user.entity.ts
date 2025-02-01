import { Column, Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { UserRole } from './user-roles.entity';
import { BaseRetailEntity } from './base-retail.entity';
import { Product } from './product.entity';
import { UserProduct } from './user-product.entity';

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

  @Column({ type: 'smallint', default: 1 })
  domain: number = 1;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;

  @Column({ type: 'boolean', default: true })
  active: boolean = true;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserProduct, userProduct => userProduct.user)
  savedProducts: Product[];
}
