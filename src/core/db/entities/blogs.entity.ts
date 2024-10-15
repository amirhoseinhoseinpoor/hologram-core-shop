import { Entity, Column } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Blogs')
export class Blogs extends BaseRetailEntity {
  @Column({ type: 'varchar', nullable: false, length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', nullable: true, unique: false, length: 150 })
  src: string;

  @Column({ type: 'varchar', nullable: true, unique: false, length: 225 })
  tags: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  active: boolean = true;

  @Column({ type: 'boolean', default: false })
  deleted: boolean = false;

  @Column({ type: 'text', nullable: true })
  content: string;
}
