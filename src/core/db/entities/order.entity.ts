import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';
import { User } from './user.entity';

@Entity('Orders')
export class Order extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  code: string;

//   @Column({ type: 'varchar', length: 150, nullable: false })
//   name: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  paid: boolean = false;//Order paid or not

  @Column({ type: 'boolean', default: false })
  finish: boolean = false;//Order sent or not

  //1:not paid, 2:Supplying, 3:Sending, 4:Delivered
  @Column({ type: 'smallint', default: 1, nullable: false, unique: false })
  type: number = 1;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;//Can be used to send SMS reminders to complete the order

  @Column('jsonb', { nullable: false, default: {} })
  info: object;

//   @Column('jsonb', { nullable: false, default: {} })
//   owner: User;

  @Column('jsonb', { nullable: true })
  products?: object[];//products list
}