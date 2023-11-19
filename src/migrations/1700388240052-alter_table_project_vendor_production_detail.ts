import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetail1700388240052
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionDetail1700388240052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "production_due_date" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "production_due_date"`,
    );
  }
}
