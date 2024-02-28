import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTableProjectVendorProductionStageAttribute1709103755183
  implements MigrationInterface
{
  name = 'FixTableProjectVendorProductionStageAttribute1709103755183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "created_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "deleted_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "deleted_at" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "deleted_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "deleted_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "created_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}
