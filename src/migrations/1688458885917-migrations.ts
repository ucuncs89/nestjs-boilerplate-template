import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1688458885917 implements MigrationInterface {
  name = 'Migrations1688458885917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "files_id_seq" OWNED BY "files"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "id" SET DEFAULT nextval('"files_id_seq"')`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "user_token_id_seq" OWNED BY "user_token"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ALTER COLUMN "id" SET DEFAULT nextval('"user_token_id_seq"')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_token" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "user_token_id_seq"`);

    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "files_id_seq"`);
  }
}
