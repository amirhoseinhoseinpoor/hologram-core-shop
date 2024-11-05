import { Entity, Column } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Header')
export class Header extends BaseRetailEntity {
  @Column('jsonb', { nullable: false })
  content: object[];
}
