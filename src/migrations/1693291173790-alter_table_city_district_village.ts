import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCityDistrictVillage1693291173790
  implements MigrationInterface
{
  name = 'AlterTableCityDistrictVillage1693291173790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "village" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "village_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "district" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "district_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "city" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "city_id_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "city_id_seq" OWNED BY "city"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ALTER COLUMN "id" SET DEFAULT nextval('"city_id_seq"')`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "district_id_seq" OWNED BY "district"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "district" ALTER COLUMN "id" SET DEFAULT nextval('"district_id_seq"')`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "village_id_seq" OWNED BY "village"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "village" ALTER COLUMN "id" SET DEFAULT nextval('"village_id_seq"')`,
    );
  }
}
