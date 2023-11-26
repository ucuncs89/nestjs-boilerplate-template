import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectMaterialItem1700990186985
  implements MigrationInterface
{
  name = 'AlterTableProjectMaterialItem1700990186985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" RENAME COLUMN "project_material_id" TO "project_detail_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" RENAME COLUMN "project_detail_id" TO "project_material_id"`,
    );
  }
}
