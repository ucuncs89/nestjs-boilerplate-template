import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCustomers1688619381542 implements MigrationInterface {
  name = 'AlterTableCustomers1688619381542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "last_order" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "last_order"`);
  }
}
