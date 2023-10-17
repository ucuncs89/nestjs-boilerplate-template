import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectSetSamplingSetNull1697519242645
  implements MigrationInterface
{
  name = 'AlterTableProjectSetSamplingSetNull1697519242645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" ALTER COLUMN "sampling_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" ALTER COLUMN "sampling_price" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" ALTER COLUMN "sampling_price" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_set_sampling" ALTER COLUMN "sampling_date" SET NOT NULL`,
    );
  }
}
