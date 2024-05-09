import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProjectAddTotalCostingSamplingPrice1715238059060
  implements MigrationInterface
{
  name = 'AlterProjectAddTotalCostingSamplingPrice1715238059060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "total_costing_price" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "total_sampling_price" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "total_sampling_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "total_costing_price"`,
    );
  }
}
