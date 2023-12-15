import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUserTokenChangeColumnName1702625696566
  implements MigrationInterface
{
  name = 'AlterTableUserTokenChangeColumnName1702625696566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "device_id"`);

    await queryRunner.query(
      `ALTER TABLE "user_token" ADD "token" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_token" DROP COLUMN "token"`);

    await queryRunner.query(
      `ALTER TABLE "user_token" ADD "device_id" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ADD "source" character varying`,
    );
  }
}
