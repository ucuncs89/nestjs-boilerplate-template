import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddCanPlanningProduction1705550392150
  implements MigrationInterface
{
  name = 'AlterTableProjectAddCanPlanningProduction1705550392150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "can_planning" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "can_production" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "can_production"`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "can_planning"`);
  }
}
