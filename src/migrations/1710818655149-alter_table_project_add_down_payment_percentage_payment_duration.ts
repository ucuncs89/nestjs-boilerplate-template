import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddDownPaymentPercentagePaymentDuration1710818655149
  implements MigrationInterface
{
  name =
    'AlterTableProjectAddDownPaymentPercentagePaymentDuration1710818655149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "down_payment_percentage" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "payment_duration" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "payment_duration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "down_payment_percentage"`,
    );
  }
}
