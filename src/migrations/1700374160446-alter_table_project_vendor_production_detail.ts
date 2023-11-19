import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetail1700374160446
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionDetail1700374160446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "production_is_completed" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "production_is_completed"`,
    );
  }
}
