import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSizeRenameSizeRationToSizeRatio1693819232575
  implements MigrationInterface
{
  name = 'AlterTableProjectSizeRenameSizeRationToSizeRatio1693819232575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" RENAME COLUMN "size_ration" TO "size_ratio"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_size" RENAME COLUMN "size_ratio" TO "size_ration"`,
    );
  }
}
