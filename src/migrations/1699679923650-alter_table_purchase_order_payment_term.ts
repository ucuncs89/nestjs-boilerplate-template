import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderPaymentTerm1699679923650
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderPaymentTerm1699679923650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "payment_term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "payment_term" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "payment_term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "payment_term" integer`,
    );
  }
}
