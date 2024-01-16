import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterial1705393277651
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterial1705393277651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" ADD "total_price" double precision NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material" DROP COLUMN "total_price"`,
    );
  }
}
