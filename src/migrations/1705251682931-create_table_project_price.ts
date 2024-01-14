import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPrice1705251682931
  implements MigrationInterface
{
  name = 'CreateTableProjectPrice1705251682931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_price" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "selling_price_per_item" double precision, "loss_percentage" double precision, "commission" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f0886d1bab677afbf1dfc9c6be6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_price"`);
  }
}
