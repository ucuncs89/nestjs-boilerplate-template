import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableInvoicePphPpn1710833603037
  implements MigrationInterface
{
  name = 'AlterTableInvoicePphPpn1710833603037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "ppn_unit"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "pph_unit"`);

    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "ppn_type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "pph_type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "pph_type"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "ppn_type"`);

    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "pph_unit" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "ppn_unit" character varying`,
    );
  }
}
