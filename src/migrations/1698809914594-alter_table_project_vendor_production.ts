import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProduction1698809914594
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProduction1698809914594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "quantity_unit_required" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "sub_total_price" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "sub_total_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "quantity_unit_required"`,
    );
  }
}
