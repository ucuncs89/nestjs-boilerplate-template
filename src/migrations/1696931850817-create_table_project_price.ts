import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPrice1696931850817
  implements MigrationInterface
{
  name = 'CreateTableProjectPrice1696931850817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_price" ("id" SERIAL NOT NULL, "project_detail_id" integer NOT NULL, "selling_price_per_item" double precision, "loss_percentage" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_f0886d1bab677afbf1dfc9c6be6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_price_additional" ("id" SERIAL NOT NULL, "project_price_id" integer NOT NULL, "additional_name" character varying, "additional_price" double precision, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_cc6239d8b64f1ea39598181523a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_price_additional"`);
    await queryRunner.query(`DROP TABLE "project_price"`);
  }
}
