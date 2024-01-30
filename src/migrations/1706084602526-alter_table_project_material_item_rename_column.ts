import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectMaterialItemRenameColumn1706084602526
  implements MigrationInterface
{
  name = 'AlterTableProjectMaterialItemRenameColumn1706084602526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" RENAME COLUMN "section_type" TO "added_in_section"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_material_item" RENAME COLUMN "added_in_section" TO "section_type"`,
    );
  }
}
