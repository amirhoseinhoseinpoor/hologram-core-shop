import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity()
export class Visit extends BaseRetailEntity {
  @Column({type: 'varchar'})
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

}
