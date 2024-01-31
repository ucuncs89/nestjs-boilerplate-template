import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectPriceAddAddedInSection1706152888295
  implements MigrationInterface
{
  name = 'AlterTableProjectPriceAddAddedInSection1706152888295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_price" ADD "added_in_section" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_price" DROP COLUMN "added_in_section"`,
    );
  }
}
