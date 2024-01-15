import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetailAddStartEndDate1705241747378
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionDetailAddStartEndDate1705241747378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "start_date" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "end_date" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "start_date"`,
    );
  }
}
