import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionPlanningCostingVendorProductionId1706600082794
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorProductionPlanningCostingVendorProductionId1706600082794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "planning_project_vendor_production_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "costing_project_vendor_production_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "costing_project_vendor_production_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "planning_project_vendor_production_id"`,
    );
  }
}
