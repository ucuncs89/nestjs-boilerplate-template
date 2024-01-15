import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectSampling1705249291475
  implements MigrationInterface
{
  name = 'CreateTableProjectSampling1705249291475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_sampling" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "name" character varying, "cost" double precision, "section_type" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_3b7f9dc5f78cefca2844f8f2026" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_sampling"`);
  }
}
