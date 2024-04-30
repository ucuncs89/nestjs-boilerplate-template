import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectHistoryAddStatusDescription1714447035287
  implements MigrationInterface
{
  name = 'AlterTableProjectHistoryAddStatusDescription1714447035287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_history" ADD "status_description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_history" DROP COLUMN "status_description"`,
    );
  }
}
