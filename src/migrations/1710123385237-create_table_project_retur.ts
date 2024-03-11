import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectRetur1710123385237
  implements MigrationInterface
{
  name = 'CreateTableProjectRetur1710123385237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_retur" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "description" text, "quantity" integer NOT NULL, "price_per_item" double precision, "sub_total" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_25857df6431cec6fc508940977e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_retur"`);
  }
}
