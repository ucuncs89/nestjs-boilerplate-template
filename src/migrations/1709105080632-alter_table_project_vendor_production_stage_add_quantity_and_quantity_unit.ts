import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionStageAddQuantityAndQuantityUnit1709105080632
  implements MigrationInterface
{
  name =
    'AlterTableProjectVendorProductionStageAddQuantityAndQuantityUnit1709105080632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ADD "quantity" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ADD "quantity_unit" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" DROP COLUMN "quantity_unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" DROP COLUMN "quantity"`,
    );
  }
}
