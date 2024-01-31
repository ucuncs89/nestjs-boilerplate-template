import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSamplingRenameColumn1706084771078
  implements MigrationInterface
{
  name = 'AlterTableProjectSamplingRenameColumn1706084771078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" RENAME COLUMN "section_type" TO "added_in_section"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_sampling" RENAME COLUMN "added_in_section" TO "section_type"`,
    );
  }
}
