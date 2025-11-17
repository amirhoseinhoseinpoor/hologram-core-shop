import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMainDb1763294253143 implements MigrationInterface {
    name = 'UpdateMainDb1763294253143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_code_not_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_navId_not_deleted"`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "UQ_8822112386455e478e51b7ecc4d" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "UQ_5bc553f79f3d2d2be12698bedd7" UNIQUE ("navId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "UQ_5bc553f79f3d2d2be12698bedd7"`);
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "UQ_8822112386455e478e51b7ecc4d"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_navId_not_deleted" ON "Products" ("navId") WHERE (deleted = false)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_code_not_deleted" ON "Products" ("code") WHERE (deleted = false)`);
    }

}
