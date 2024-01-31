import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectShippingRenameColumn1706084908828
  implements MigrationInterface
{
  name = 'AlterTableProjectShippingRenameColumn1706084908828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" RENAME COLUMN "section_type" TO "added_in_section"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_shipping" RENAME COLUMN "added_in_section" TO "section_type"`,
    );
  }
}
