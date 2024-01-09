import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddMaterialSource1704784402778
  implements MigrationInterface
{
  name = 'AlterTableProjectAddMaterialSource1704784402778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "material_source" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "material_source"`,
    );
  }
}
