import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddStatusBeforeChange1714445527249
  implements MigrationInterface
{
  name = 'AlterTableProjectAddStatusBeforeChange1714445527249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "status_before_change" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "status_before_change"`,
    );
  }
}
