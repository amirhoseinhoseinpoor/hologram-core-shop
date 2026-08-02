import { Entity, Column } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('OtpCode')
export class OtpCode extends BaseRetailEntity {
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;
}