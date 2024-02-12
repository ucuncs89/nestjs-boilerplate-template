import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectDetailCalculate1707289603696
  implements MigrationInterface
{
  name = 'AlterTableProjectDetailCalculate1707289603696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" ADD "added_in_section" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" DROP CONSTRAINT "PK_d31b4908ad5f487febdf2687d5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" ADD CONSTRAINT "PK_e8c72fe194b4aec6b89fb1756e3" PRIMARY KEY ("project_id", "type", "added_in_section")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" DROP CONSTRAINT "PK_e8c72fe194b4aec6b89fb1756e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" ADD CONSTRAINT "PK_d31b4908ad5f487febdf2687d5a" PRIMARY KEY ("project_id", "type")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_detail_calculate" DROP COLUMN "added_in_section"`,
    );
  }
}
