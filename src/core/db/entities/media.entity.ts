import { Column, Entity } from 'typeorm';
import { BaseRetailEntity } from './base-retail.entity';

@Entity('Media')
export class Media extends BaseRetailEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  tag: string;

  //1:image, 2:video, 3:...
  @Column({ type: 'smallint', default: 1, nullable: false, unique: false })
  type: number = 1;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  originalName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  fileName: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean = false;

  @Column({ type: 'boolean', default: true })
  active: boolean = true;
}
