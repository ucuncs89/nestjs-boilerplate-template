import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectAdditionalCost1705247106964
  implements MigrationInterface
{
  name = 'CreateTableProjectAdditionalCost1705247106964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_additional_cost" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "additional_name" character varying, "additional_price" double precision, "description" text, "section_type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_5d0880db0ca1430c35ec68455d9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_additional_cost"`);
  }
}
