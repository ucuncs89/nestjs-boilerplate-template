import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddSequentialNumber1697095050217
  implements MigrationInterface
{
  name = 'AlterTableProjectAddSequentialNumber1697095050217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "sequential_number" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "sequential_number"`,
    );
  }
}
