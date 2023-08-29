import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProvince1693290886964 implements MigrationInterface {
  name = 'AlterTableProvince1693290886964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "province" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "province_id_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "province_id_seq" OWNED BY "province"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" ALTER COLUMN "id" SET DEFAULT nextval('"province_id_seq"')`,
    );
  }
}
