import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCustomersAddIsActive1693210387557
  implements MigrationInterface
{
  name = 'AlterTableCustomersAddIsActive1693210387557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "is_active" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "is_active"`);
  }
}
