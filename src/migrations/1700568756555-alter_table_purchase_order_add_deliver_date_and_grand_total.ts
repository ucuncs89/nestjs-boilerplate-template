import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderAddDeliverDateAndGrandTotal1700568756555
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderAddDeliverDateAndGrandTotal1700568756555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "delivery_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "grand_total" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "grand_total"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "delivery_date"`,
    );
  }
}
