import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShippingPlanningCostingId1706600688380
  implements MigrationInterface
{
  name = 'AlterTableProjectShippingPlanningCostingId1706600688380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "planning_project_shipping_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "costing_project_shipping_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "costing_project_shipping_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "planning_project_shipping_id"`,
    );
  }
}
