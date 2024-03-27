import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrderInvoicePaymentTerm1711513735155
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrderInvoicePaymentTerm1711513735155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "payment_term"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "payment_term" integer`);

    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "payment_term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "payment_term" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "payment_term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "payment_term" character varying`,
    );

    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "payment_term"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "payment_term" character varying`,
    );
  }
}
