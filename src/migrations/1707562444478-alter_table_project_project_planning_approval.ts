import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectProjectPlanningApproval1707562444478
  implements MigrationInterface
{
  name = 'AlterTableProjectProjectPlanningApproval1707562444478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ADD "project_id" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" DROP COLUMN "project_id"`,
    );
  }
}
