import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUsers1687230436710 implements MigrationInterface {
  name = 'AlterTableUsers1687230436710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "need_verification" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "path_picture" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "base_path" text`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_forgot_password" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "is_forgot_password"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "base_path"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "path_picture"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "need_verification"`,
    );
  }
}
