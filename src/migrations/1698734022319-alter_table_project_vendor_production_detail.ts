import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionDetail1698734022319
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionDetail1698734022319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "activity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" DROP COLUMN "activity_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" ADD "activity_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production" DROP COLUMN "activity_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "activity_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_detail" ADD "activity_id" integer NOT NULL`,
    );
  }
}
