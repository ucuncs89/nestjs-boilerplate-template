import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectSamplingStatusAndRevisi1699672575034
  implements MigrationInterface
{
  name = 'CreateTableProjectSamplingStatusAndRevisi1699672575034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_sampling_revisi" ("id" SERIAL NOT NULL, "project_set_sampling_id" integer NOT NULL, "title" character varying NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ddda49213955e7e4ae60a6130f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_sampling_status" ("id" SERIAL NOT NULL, "project_set_sampling_id" integer NOT NULL, "status" character varying NOT NULL, "is_validate" boolean, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_419d910c36c0dd0ffd49bf321b6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_sampling_status"`);
    await queryRunner.query(`DROP TABLE "project_sampling_revisi"`);
  }
}
