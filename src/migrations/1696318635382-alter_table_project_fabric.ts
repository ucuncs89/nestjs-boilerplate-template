import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectFabric1696318635382
  implements MigrationInterface
{
  name = 'AlterTableProjectFabric1696318635382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_fabric" RENAME COLUMN "project_detail_id" TO "project_material_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_fabric" RENAME COLUMN "project_material_id" TO "project_detail_id"`,
    );
  }
}
