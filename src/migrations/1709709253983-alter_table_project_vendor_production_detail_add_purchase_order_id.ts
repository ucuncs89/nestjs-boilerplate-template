import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetailAddPurchaseOrderId1709709253983
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorProductionDetailAddPurchaseOrderId1709709253983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "purchase_order_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "purchase_order_id"`,
    );
  }
}
