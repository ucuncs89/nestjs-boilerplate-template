import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSetSamplingAddIsCompleted1699676617958
  implements MigrationInterface
{
  name = 'AlterTableProjectSetSamplingAddIsCompleted1699676617958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" ADD "is_completed" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" DROP COLUMN "is_completed"`,
    );
  }
}
