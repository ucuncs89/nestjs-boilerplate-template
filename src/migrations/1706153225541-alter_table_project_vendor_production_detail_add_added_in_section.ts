import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetailAddAddedInSection1706153225541
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorProductionDetailAddAddedInSection1706153225541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "added_in_section" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "added_in_section"`,
    );
  }
}
