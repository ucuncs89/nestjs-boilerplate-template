import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropInvoice1709884131913 implements MigrationInterface {
  name = 'DropInvoice1709884131913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS invoice_approval`);
    await queryRunner.query(`DROP TABLE IF EXISTS invoice_history`);
    await queryRunner.query(`DROP TABLE IF EXISTS invoice`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
