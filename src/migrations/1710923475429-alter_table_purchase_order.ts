import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePurchaseOrder1710923475429
  implements MigrationInterface
{
  name = 'AlterTablePurchaseOrder1710923475429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "ppn_unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "pph_unit"`,
    );

    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "ppn_type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "pph_type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "pph_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "ppn_type"`,
    );

    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "pph_unit" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "ppn_unit" character varying`,
    );
  }
}
