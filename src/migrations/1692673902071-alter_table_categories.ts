import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCategories1692673902071 implements MigrationInterface {
  name = 'AlterTableCategories1692673902071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "parent_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "parent_id" SET NOT NULL`,
    );
  }
}
