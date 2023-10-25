import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableProjectAddColumn1698220066062
  implements MigrationInterface
{
  name = 'AlterTableProjectAddColumn1698220066062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "is_sent_deadline" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "is_sent_deadline"`,
    );
  }
}
