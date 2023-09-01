import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableVendorsAddIsActive1693535622806
  implements MigrationInterface
{
  name = 'AlterTableVendorsAddIsActive1693535622806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "is_active" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "is_active"`);
  }
}
