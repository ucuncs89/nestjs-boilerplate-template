import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectMaterialItemPlanningCostingMaterialItemId1706599532153
  implements MigrationInterface
{
  name =
    'AlterTableProjectMaterialItemPlanningCostingMaterialItemId1706599532153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" ADD "planning_material_item_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_material_item" ADD "costing_material_item_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" DROP COLUMN "costing_material_item_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_material_item" DROP COLUMN "planning_material_item_id"`,
    );
  }
}
