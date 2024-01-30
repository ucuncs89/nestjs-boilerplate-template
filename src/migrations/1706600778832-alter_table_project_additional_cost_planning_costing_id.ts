import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAdditionalCostPlanningCostingId1706600778832
  implements MigrationInterface
{
  name = 'AlterTableProjectAdditionalCostPlanningCostingId1706600778832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" ADD "planning_project_additional_cost_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" ADD "costing_project_additional_cost_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" DROP COLUMN "costing_project_additional_cost_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" DROP COLUMN "planning_project_additional_cost_id"`,
    );
  }
}
