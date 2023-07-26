import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableVendor1690341374224 implements MigrationInterface {
  name = 'AlterTableVendor1690341374224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "npwp_number" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "bank_name" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "bank_account_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "bank_account_holder_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP COLUMN "bank_account_holder_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP COLUMN "bank_account_number"`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "bank_name"`);
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "npwp_number"`);
  }
}
