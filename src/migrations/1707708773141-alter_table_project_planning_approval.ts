import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectPlanningApproval1707708773141
  implements MigrationInterface
{
  name = 'AlterTableProjectPlanningApproval1707708773141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_planning_approval" DROP COLUMN "name"`,
    );
  }
}
