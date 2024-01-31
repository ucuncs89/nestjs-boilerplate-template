import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionAddAddedInSection1706153099054
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionAddAddedInSection1706153099054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "added_in_section" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "added_in_section"`,
    );
  }
}
