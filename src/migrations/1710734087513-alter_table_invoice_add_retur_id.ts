import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoiceAddReturId1710734087513
  implements MigrationInterface
{
  name = 'AlterTableInvoiceAddReturId1710734087513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "retur_id" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "retur_id"`);
  }
}
