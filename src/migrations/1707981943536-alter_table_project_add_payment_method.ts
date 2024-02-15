import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddPaymentMethod1707981943536
  implements MigrationInterface
{
  name = 'AlterTableProjectAddPaymentMethod1707981943536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "payment_method" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "payment_method"`,
    );
  }
}
