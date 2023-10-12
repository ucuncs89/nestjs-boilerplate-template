import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialAccessoriesPackagingDetail1697098255277
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_accessories_packaging_detail
              ALTER COLUMN quantity TYPE double precision;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_accessories_packaging_detail
              ALTER COLUMN quantity TYPE integer;`,
    );
  }
}
