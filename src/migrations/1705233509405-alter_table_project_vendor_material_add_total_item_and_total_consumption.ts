import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialAddTotalItemAndTotalConsumption1705233509405
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorMaterialAddTotalItemAndTotalConsumption1705233509405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" ADD "total_item" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" ADD "total_consumption" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" DROP COLUMN "total_consumption"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" DROP COLUMN "total_item"`,
    );
  }
}
