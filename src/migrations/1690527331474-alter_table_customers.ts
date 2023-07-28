import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCustomers1690527331474 implements MigrationInterface {
  name = 'AlterTableCustomers1690527331474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "npwp_number" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "bank_name" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "bank_account_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "bank_account_holder_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "bank_account_holder_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "bank_account_number"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "bank_name"`);
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "npwp_number"`,
    );
  }
}
