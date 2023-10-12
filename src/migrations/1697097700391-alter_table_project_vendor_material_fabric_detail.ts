import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialDetailAll1697097700391
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterialDetailAll1697097700391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_fabric_detail
      ALTER COLUMN quantity TYPE double precision;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE project_vendor_material_fabric_detail
      ALTER COLUMN quantity TYPE integer;`,
    );
  }
}
