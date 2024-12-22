import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';
import { User } from './user.entity';
import { ManyToMany } from 'typeorm';

@Entity('Products')
export class Product extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean = true;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;

  @Column('jsonb', { nullable: false, default: {} })
  info: object;

  @Column('jsonb', { nullable: true })
  media?: object[];

  @ManyToMany(() => User, user => user.savedProducts)
  savedBy: User[];
}
