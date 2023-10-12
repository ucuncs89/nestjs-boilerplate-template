import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialAccessoriesSewingDetail1697098167161
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_accessories_sewing_detail
          ALTER COLUMN quantity TYPE double precision;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_accessories_sewing_detail
          ALTER COLUMN quantity TYPE integer;`,
    );
  }
}
