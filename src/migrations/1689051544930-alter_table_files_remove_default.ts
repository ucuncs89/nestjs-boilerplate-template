import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFilesRemoveDefault1689051544930
  implements MigrationInterface
{
  name = 'AlterTableFilesRemoveDefault1689051544930';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE files ALTER COLUMN deleted_at DROP DEFAULT;`,
    );
    await queryRunner.query(
      `ALTER TABLE files ALTER COLUMN deleted_at DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE files ALTER COLUMN deleted_at DROP DEFAULT;`,
    );
    await queryRunner.query(
      `ALTER TABLE files ALTER COLUMN deleted_at DROP NOT NULL;`,
    );
  }
}
