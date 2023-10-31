import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProduction1698733763241
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProduction1698733763241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "sewing_percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "cutting_percentage_of_loss"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "activity_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "percentage_of_loss" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "percentage_of_loss"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "activity_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "cutting_percentage_of_loss" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "sewing_percentage_of_loss" double precision`,
    );
  }
}
