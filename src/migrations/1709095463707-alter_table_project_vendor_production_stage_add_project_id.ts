import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorProductionStageAddProjectId1709095463707
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorProductionStageAddProjectId1709095463707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" ADD "project_id" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_production_stage" DROP COLUMN "project_id"`,
    );
  }
}
