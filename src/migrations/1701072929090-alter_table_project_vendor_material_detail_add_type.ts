import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectVendorMaterialDetailAddType1701072929090
  implements MigrationInterface
{
  name = 'AlterTableProjectVendorMaterialDetailAddType1701072929090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" ADD "type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_vendor_material_detail" DROP COLUMN "type"`,
    );
  }
}
