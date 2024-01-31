import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAdditionalCostRenameColumn1706084378520
  implements MigrationInterface
{
  name = 'AlterTableProjectAdditionalCostRenameColumn1706084378520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" RENAME COLUMN "section_type" TO "added_in_section"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_additional_cost" RENAME COLUMN "added_in_section" TO "section_type"`,
    );
  }
}
