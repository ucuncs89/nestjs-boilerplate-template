import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceAddDescription1711352825478
  implements MigrationInterface
{
  name = 'AlterTableInvoiceAddDescription1711352825478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "description"`);
  }
}
