import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectPlanningApproval1707383479419
  implements MigrationInterface
{
  name = 'AlterTableProjectPlanningApproval1707383479419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "project_planning_approval_id_seq" OWNED BY "project_planning_approval"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "id" SET DEFAULT nextval('"project_planning_approval_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "relation_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "status_desc" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "status_desc" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "relation_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "project_planning_approval_id_seq"`);
  }
}
