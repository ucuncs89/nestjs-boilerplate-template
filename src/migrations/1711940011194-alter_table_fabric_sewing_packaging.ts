import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFabricSewingPackaging1711940011194
  implements MigrationInterface
{
  name = 'AlterTableFabricSewingPackaging1711940011194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accessories_sewing" ADD "unit_of_measure" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "accessories_packaging" ADD "unit_of_measure" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric" ADD "unit_of_measure" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fabric" DROP COLUMN "unit_of_measure"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accessories_packaging" DROP COLUMN "unit_of_measure"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accessories_sewing" DROP COLUMN "unit_of_measure"`,
    );
  }
}
