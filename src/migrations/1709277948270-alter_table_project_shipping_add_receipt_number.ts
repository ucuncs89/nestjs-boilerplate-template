import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShippingAddReceiptNumber1709277948270
  implements MigrationInterface
{
  name = 'AlterTableProjectShippingAddReceiptNumber1709277948270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" ADD "receipt_number" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" DROP COLUMN "receipt_number"`,
    );
  }
}
