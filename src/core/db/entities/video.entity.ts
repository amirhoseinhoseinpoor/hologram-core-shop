import { Entity, Column } from "typeorm";
import { BaseRetailEntity } from "./base-retail.entity";

@Entity('Video')
export class Video extends BaseRetailEntity {

    @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
    code: string;

    @Column({ type: 'boolean', nullable: false, default: true })
    active: boolean = true;

    @Column({ type: 'boolean', default: false })
    deleted: boolean = false;

    @Column('jsonb', { nullable: true })
    media: object[];
}
