import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialDetail1708312643767
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterialDetail1708312643767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" ADD "status_purchase_order" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" DROP COLUMN "status_purchase_order"`,
    );
  }
}
