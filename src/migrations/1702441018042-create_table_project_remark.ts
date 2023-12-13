import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectRemark1702441018042
  implements MigrationInterface
{
  name = 'CreateTableProjectRemark1702441018042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_remarks" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_fd1286cca2e495b5ff3d2b98ea4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_remarks"`);
  }
}
