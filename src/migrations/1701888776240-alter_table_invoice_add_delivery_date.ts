import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceAddDeliveryDate1701888776240
  implements MigrationInterface
{
  name = 'AlterTableInvoiceAddDeliveryDate1701888776240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "delivery_date" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "delivery_date"`,
    );
  }
}
