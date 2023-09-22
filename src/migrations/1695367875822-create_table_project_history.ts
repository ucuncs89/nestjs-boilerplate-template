import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectHistory1695367875822
  implements MigrationInterface
{
  name = 'CreateTableProjectHistory1695367875822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_history" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_ebb2afe7b38faa45844bfa91211" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_history" ADD CONSTRAINT "FK_fba27c15eca183d4a3af4915735" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_history" DROP CONSTRAINT "FK_fba27c15eca183d4a3af4915735"`,
    );

    await queryRunner.query(`DROP TABLE "project_history"`);
  }
}
