import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAdditionalCostAddReturId1710514568681
  implements MigrationInterface
{
  name = 'AlterTableProjectAdditionalCostAddReturId1710514568681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" ADD "retur_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" DROP COLUMN "retur_id"`,
    );
  }
}
