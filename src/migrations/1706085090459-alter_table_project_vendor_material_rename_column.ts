import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialRenameColumn1706085090459
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterialRenameColumn1706085090459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" RENAME COLUMN "section_type" TO "added_in_section"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" RENAME COLUMN "added_in_section" TO "section_type"`,
    );
  }
}
