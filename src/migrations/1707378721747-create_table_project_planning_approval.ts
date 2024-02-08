import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableProjectPlanningApproval1707378721747
  implements MigrationInterface
{
  name = 'CreateTableProjectPlanningApproval1707378721747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_planning_approval" ("id" integer NOT NULL, "relation_id" integer NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL, "status_desc" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_c50fa4742d7150e97031b89468a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project_planning_approval"`);
  }
}
