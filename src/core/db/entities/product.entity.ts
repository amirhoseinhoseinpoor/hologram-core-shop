import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Products')
export class Product extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean = true;

  @Column('jsonb', { nullable: false, default: {} })
  info: object;

  @Column('jsonb', { nullable: true })
  media?: object[];
}
