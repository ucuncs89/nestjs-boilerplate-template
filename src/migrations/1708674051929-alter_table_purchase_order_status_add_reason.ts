import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderStatusAddReason1708674051929
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderStatusAddReason1708674051929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order_status" ADD "reason" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order_status" DROP COLUMN "reason"`,
    );
  }
}
