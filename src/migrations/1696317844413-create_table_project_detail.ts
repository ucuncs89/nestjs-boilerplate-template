import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectDetail1696317844413
  implements MigrationInterface
{
  name = 'CreateTableProjectDetail1696317844413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_detail" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_fcd9f4f04c652db3bcb3b412d17" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_detail"`);
  }
}
