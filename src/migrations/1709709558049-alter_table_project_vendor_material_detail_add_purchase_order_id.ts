import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialDetailAddPurchaseOrderId1709709558049
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterialDetailAddPurchaseOrderId1709709558049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" ADD "purchase_order_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" DROP COLUMN "purchase_order_id"`,
    );
  }
}
