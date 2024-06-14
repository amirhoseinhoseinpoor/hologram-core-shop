import { Column, Entity } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Uploads')
export class Upload extends BaseRetailEntity {
  @Column({ type: 'smallint', nullable: false, unique: false })
  type: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  originalName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  fileName: string;

  @Column({ type: 'boolean', default: true })
  active: boolean = true;
}
