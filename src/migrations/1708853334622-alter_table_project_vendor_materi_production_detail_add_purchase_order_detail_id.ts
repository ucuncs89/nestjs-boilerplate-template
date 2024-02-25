import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMateriProductionDetailAddPurchaseOrderDetailId1708853334622
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorMateriProductionDetailAddPurchaseOrderDetailId1708853334622';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" ADD "purchase_order_detail_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "purchase_order_detail_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "purchase_order_detail_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" DROP COLUMN "purchase_order_detail_id"`,
    );
  }
}
