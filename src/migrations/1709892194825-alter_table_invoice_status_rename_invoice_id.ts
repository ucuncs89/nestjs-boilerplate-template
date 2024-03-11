import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceStatusRenameInvoiceId1709892194825
  implements MigrationInterface
{
  name = 'AlterTableInvoiceStatusRenameInvoiceId1709892194825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_status" RENAME COLUMN "invoice" TO "invoice_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_status" RENAME COLUMN "invoice_id" TO "invoice"`,
    );
  }
}
