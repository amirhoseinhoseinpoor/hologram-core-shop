import { Entity, Column } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Contact')
export class Contact extends BaseRetailEntity {
  @Column({ type: 'varchar', nullable: false, length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'varchar', nullable: true, length: 45 })
  ip: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  deleted: boolean;
}
