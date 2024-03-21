import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderAddPaymentStatus1711008673345
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderAddPaymentStatus1711008673345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "status_payment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "status_payment_attempt_user" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "status_payment_attempt_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "status_payment"`,
    );
  }
}
