import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProduction1698735312881
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProduction1698735312881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "total_quantity" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "total_quantity"`,
    );
  }
}
