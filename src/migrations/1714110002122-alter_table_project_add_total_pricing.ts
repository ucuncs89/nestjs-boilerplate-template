import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddTotalPricing1714110002122
  implements MigrationInterface
{
  name = 'AlterTableProjectAddTotalPricing1714110002122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "total_planning_price" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "total_production_price" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "total_production_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "total_planning_price"`,
    );
  }
}
