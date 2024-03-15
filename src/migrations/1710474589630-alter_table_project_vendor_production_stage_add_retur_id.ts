import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionStageAddReturId1710474589630
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionStageAddReturId1710474589630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ADD "retur_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" DROP COLUMN "retur_id"`,
    );
  }
}
