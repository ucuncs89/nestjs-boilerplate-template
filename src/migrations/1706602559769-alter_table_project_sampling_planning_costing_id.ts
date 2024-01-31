import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSamplingPlanningCostingId1706602559769
  implements MigrationInterface
{
  name = 'AlterTableProjectSamplingPlanningCostingId1706602559769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" ADD "planning_project_project_sampling_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_sampling" ADD "costing_project_project_sampling_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" DROP COLUMN "costing_project_project_sampling_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_sampling" DROP COLUMN "planning_project_project_sampling_id"`,
    );
  }
}
