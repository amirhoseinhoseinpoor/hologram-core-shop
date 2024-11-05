import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Orders')
export class Order extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  code: string;

  //1:Registering, 2:confirmed, 3:PayOff, 4:Preparing, 5:Sending, 6:Delivered, 7.Suspend
  @Column({ type: 'smallint', default: 1, nullable: false, unique: false })
  status: number = 1;

  @Column({ type: 'smallint', default: 1, nullable: false, unique: false })
  step: number = 1;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;

  @Column('jsonb', { nullable: false, default: {} })
  request: object;

  @Column('jsonb', { nullable: false, default: {} })
  reqComment: object;

  @Column('jsonb', { nullable: false, default: {} })
  document: object;

  @Column('jsonb', { nullable: false, default: {} })
  docComment: object;

  @Column('jsonb', { nullable: false })
  chat: object[];

  @Column('jsonb', { nullable: false, default: {} })
  delivery: object;

  @Column('jsonb', { nullable: false, default: {} })
  payment: object;
}
