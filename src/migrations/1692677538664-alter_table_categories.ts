import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCategories1692677538664 implements MigrationInterface {
  name = 'AlterTableCategories1692677538664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "code" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "code" SET NOT NULL`,
    );
  }
}
