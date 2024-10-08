import { Entity, Column } from "typeorm";
import { BaseRetailEntity } from "./base-retail.entity";

@Entity('Honors')
export class Honors extends BaseRetailEntity {

    @Column({ type: 'varchar', nullable: false, length: 10, unique: true })
    code: string;

    @Column({ type: 'varchar', nullable: false, unique: false, length: 225 })
    title: string;

    @Column({ type: 'boolean', nullable: false, default: true })
    active: boolean = true;

    @Column({ type: 'boolean', default: false })
    deleted: boolean = false;

    @Column('jsonb', { nullable: false })
    content: object[];
}