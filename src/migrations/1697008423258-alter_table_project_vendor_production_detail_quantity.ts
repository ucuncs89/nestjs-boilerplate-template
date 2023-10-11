import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetailQuantity1697008423258
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionDetailQuantity1697008423258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "quantity" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "quantity" integer`,
    );
  }
}
