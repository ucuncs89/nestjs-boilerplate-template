import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceAddStatusPayment1711007225448
  implements MigrationInterface
{
  name = 'AlterTableInvoiceAddStatusPayment1711007225448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "status_payment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "status_payment_attempt_user" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "status_payment_attempt_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "status_payment"`,
    );
  }
}
